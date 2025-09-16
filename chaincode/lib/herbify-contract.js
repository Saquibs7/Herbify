const { Contract, Context } = require('fabric-contract-api');
const crypto = require('crypto');

class HerbifyContract extends Contract {

    constructor() {
        super('HerbifyContract');
    }

    // Initialize the ledger with some test data
    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        
        // Initialize with some allowed species and geo-fences
        const allowedSpecies = [
            'Withania somnifera',
            'Curcuma longa', 
            'Ocimum tenuiflorum',
            'Bacopa monnieri',
            'Centella asiatica'
        ];

        await ctx.stub.putState('ALLOWED_SPECIES', Buffer.from(JSON.stringify(allowedSpecies)));
        
        console.info('============= END : Initialize Ledger ===========');
    }

    // === CORE CHAINCODE FUNCTIONS ===

    // Provision RFID tag with batch metadata
    async provisionTag(ctx, tagUID, batchID, provisionerID, metaHash) {
        console.info('============= START : Provision Tag ===========');
        
        // Check if tag already exists
        const existingTag = await ctx.stub.getState(tagUID);
        if (existingTag && existingTag.length > 0) {
            throw new Error(`Tag ${tagUID} already exists`);
        }

        const tagRecord = {
            objectType: 'rfidTag',
            tagUID: tagUID,
            batchID: batchID,
            provisionerID: provisionerID,
            metaHash: metaHash,
            status: 'provisioned',
            timestamp: new Date().toISOString(),
            owner: provisionerID
        };

        await ctx.stub.putState(tagUID, Buffer.from(JSON.stringify(tagRecord)));
        
        // Emit event
        ctx.stub.setEvent('TagProvisioned', Buffer.from(JSON.stringify(tagRecord)));
        
        console.info('============= END : Provision Tag ===========');
        return JSON.stringify(tagRecord);
    }

    // Record collection event with geo-fencing and seasonal checks
    async recordCollectionEvent(ctx, eventID, collectorID, species, latitude, longitude, bagIDs, metaHash) {
        console.info('============= START : Record Collection Event ===========');
        
        // Verify collector identity (basic check)
        const clientID = ctx.clientIdentity.getID();
        if (!clientID) {
            throw new Error('Invalid client identity');
        }

        // Get allowed species
        const allowedSpeciesBuffer = await ctx.stub.getState('ALLOWED_SPECIES');
        const allowedSpecies = JSON.parse(allowedSpeciesBuffer.toString());
        
        if (!allowedSpecies.includes(species)) {
            throw new Error(`Species ${species} is not allowed for collection`);
        }

        // Basic geo-fence check (simplified - in production would use complex polygons)
        if (!this._checkGeoFence(species, parseFloat(latitude), parseFloat(longitude))) {
            throw new Error('Collection location is outside allowed geo-fence');
        }

        // Seasonal check (simplified)
        if (!this._checkSeasonalWindow(species)) {
            throw new Error('Collection is outside allowed seasonal window');
        }

        const collectionEvent = {
            objectType: 'collectionEvent',
            eventID: eventID,
            collectorID: collectorID,
            species: species,
            latitude: latitude,
            longitude: longitude,
            bagIDs: JSON.parse(bagIDs),
            metaHash: metaHash,
            status: 'recorded',
            timestamp: new Date().toISOString(),
            owner: collectorID
        };

        await ctx.stub.putState(eventID, Buffer.from(JSON.stringify(collectionEvent)));

        // Update bag ownership
        const bagIDArray = JSON.parse(bagIDs);
        for (const bagID of bagIDArray) {
            await this._updateBagOwnership(ctx, bagID, collectorID, eventID);
        }
        
        // Emit event
        ctx.stub.setEvent('CollectionEventRecorded', Buffer.from(JSON.stringify(collectionEvent)));
        
        console.info('============= END : Record Collection Event ===========');
        return JSON.stringify(collectionEvent);
    }

    // Create transport batch by grouping bags
    async createTransportBatch(ctx, batchID, bagIDs, transporterID, truckID, metaHash) {
        console.info('============= START : Create Transport Batch ===========');
        
        // Verify bags exist and are available
        const bagIDArray = JSON.parse(bagIDs);
        const bagDetails = [];
        
        for (const bagID of bagIDArray) {
            const bagBuffer = await ctx.stub.getState(bagID);
            if (!bagBuffer || bagBuffer.length === 0) {
                throw new Error(`Bag ${bagID} does not exist`);
            }
            
            const bag = JSON.parse(bagBuffer.toString());
            if (bag.status !== 'provisioned' && bag.status !== 'collected') {
                throw new Error(`Bag ${bagID} is not available for transport (status: ${bag.status})`);
            }
            bagDetails.push(bag);
        }

        const transportBatch = {
            objectType: 'transportBatch',
            batchID: batchID,
            type: 'transport',
            bagIDs: bagIDArray,
            transporterID: transporterID,
            truckID: truckID,
            metaHash: metaHash,
            status: 'in_transit',
            timestamp: new Date().toISOString(),
            owner: transporterID,
            parentBags: bagIDArray
        };

        await ctx.stub.putState(batchID, Buffer.from(JSON.stringify(transportBatch)));

        // Update bag status to in_transit
        for (const bagID of bagIDArray) {
            await this._updateBagStatus(ctx, bagID, 'in_transit', batchID);
        }
        
        // Emit event
        ctx.stub.setEvent('TransportBatchCreated', Buffer.from(JSON.stringify(transportBatch)));
        
        console.info('============= END : Create Transport Batch ===========');
        return JSON.stringify(transportBatch);
    }

    // Consume bags and create processed batch
    async consumeBagsAndCreateProcessedBatch(ctx, inputBatchIDs, outputBatchID, processorID, metaHash) {
        console.info('============= START : Create Processed Batch ===========');
        
        const inputBatchArray = JSON.parse(inputBatchIDs);
        const inputBags = [];
        
        // Verify input batches exist and collect all bags
        for (const batchID of inputBatchArray) {
            const batchBuffer = await ctx.stub.getState(batchID);
            if (!batchBuffer || batchBuffer.length === 0) {
                throw new Error(`Batch ${batchID} does not exist`);
            }
            
            const batch = JSON.parse(batchBuffer.toString());
            if (batch.status !== 'in_transit' && batch.status !== 'delivered') {
                throw new Error(`Batch ${batchID} is not available for processing`);
            }
            
            inputBags.push(...batch.bagIDs);
        }

        const processedBatch = {
            objectType: 'processedBatch',
            batchID: outputBatchID,
            type: 'processed',
            processorID: processorID,
            inputBatches: inputBatchArray,
            inputBags: inputBags,
            metaHash: metaHash,
            status: 'processed',
            timestamp: new Date().toISOString(),
            owner: processorID,
            parentBatches: inputBatchArray
        };

        await ctx.stub.putState(outputBatchID, Buffer.from(JSON.stringify(processedBatch)));

        // Update parent batch status to consumed
        for (const batchID of inputBatchArray) {
            await this._updateBatchStatus(ctx, batchID, 'consumed');
        }
        
        // Emit event
        ctx.stub.setEvent('ProcessedBatchCreated', Buffer.from(JSON.stringify(processedBatch)));
        
        console.info('============= END : Create Processed Batch ===========');
        return JSON.stringify(processedBatch);
    }

    // Record processing step
    async recordProcessingStep(ctx, stepID, batchID, operation, parameters, operatorID, metaHash) {
        console.info('============= START : Record Processing Step ===========');
        
        // Verify batch exists
        const batchBuffer = await ctx.stub.getState(batchID);
        if (!batchBuffer || batchBuffer.length === 0) {
            throw new Error(`Batch ${batchID} does not exist`);
        }

        const processingStep = {
            objectType: 'processingStep',
            stepID: stepID,
            batchID: batchID,
            operation: operation,
            parameters: JSON.parse(parameters),
            operatorID: operatorID,
            metaHash: metaHash,
            timestamp: new Date().toISOString(),
            owner: operatorID
        };

        await ctx.stub.putState(stepID, Buffer.from(JSON.stringify(processingStep)));
        
        // Emit event
        ctx.stub.setEvent('ProcessingStepRecorded', Buffer.from(JSON.stringify(processingStep)));
        
        console.info('============= END : Record Processing Step ===========');
        return JSON.stringify(processingStep);
    }

    // Record quality test results
    async recordQualityTest(ctx, testID, batchID, labID, testResults, metaHash) {
        console.info('============= START : Record Quality Test ===========');
        
        // Verify batch exists
        const batchBuffer = await ctx.stub.getState(batchID);
        if (!batchBuffer || batchBuffer.length === 0) {
            throw new Error(`Batch ${batchID} does not exist`);
        }

        const testResultsObj = JSON.parse(testResults);
        const overallPass = this._evaluateQualityGates(testResultsObj);

        const qualityTest = {
            objectType: 'qualityTest',
            testID: testID,
            batchID: batchID,
            labID: labID,
            testResults: testResultsObj,
            overallPass: overallPass,
            metaHash: metaHash,
            timestamp: new Date().toISOString(),
            owner: labID
        };

        await ctx.stub.putState(testID, Buffer.from(JSON.stringify(qualityTest)));

        // Update batch status based on test results
        const newStatus = overallPass ? 'approved' : 'quarantined';
        await this._updateBatchStatus(ctx, batchID, newStatus);
        
        // Emit event
        ctx.stub.setEvent('QualityTestRecorded', Buffer.from(JSON.stringify(qualityTest)));
        
        console.info('============= END : Record Quality Test ===========');
        return JSON.stringify(qualityTest);
    }

    // Generate smart label with signature
    async generateSmartLabel(ctx, batchID, labelMeta) {
        console.info('============= START : Generate Smart Label ===========');
        
        // Verify batch exists and is approved
        const batchBuffer = await ctx.stub.getState(batchID);
        if (!batchBuffer || batchBuffer.length === 0) {
            throw new Error(`Batch ${batchID} does not exist`);
        }

        const batch = JSON.parse(batchBuffer.toString());
        if (batch.status !== 'approved') {
            throw new Error(`Batch ${batchID} is not approved for labeling`);
        }

        const labelData = {
            batchID: batchID,
            labelMeta: JSON.parse(labelMeta),
            timestamp: new Date().toISOString(),
            issuer: ctx.clientIdentity.getID()
        };

        // Generate signature (simplified - in production use HSM)
        const signature = crypto
            .createHash('sha256')
            .update(JSON.stringify(labelData))
            .digest('hex');

        const smartLabel = {
            objectType: 'smartLabel',
            labelID: `label_${batchID}_${Date.now()}`,
            batchID: batchID,
            labelData: labelData,
            signature: signature,
            timestamp: new Date().toISOString()
        };

        await ctx.stub.putState(smartLabel.labelID, Buffer.from(JSON.stringify(smartLabel)));
        
        // Emit event
        ctx.stub.setEvent('SmartLabelGenerated', Buffer.from(JSON.stringify(smartLabel)));
        
        console.info('============= END : Generate Smart Label ===========');
        return JSON.stringify(smartLabel);
    }

    // Transfer batch ownership
    async transferBatch(ctx, batchID, fromOrg, toOrg) {
        console.info('============= START : Transfer Batch ===========');
        
        const batchBuffer = await ctx.stub.getState(batchID);
        if (!batchBuffer || batchBuffer.length === 0) {
            throw new Error(`Batch ${batchID} does not exist`);
        }

        const batch = JSON.parse(batchBuffer.toString());
        if (batch.owner !== fromOrg) {
            throw new Error(`Batch ${batchID} is not owned by ${fromOrg}`);
        }

        batch.owner = toOrg;
        batch.transferHistory = batch.transferHistory || [];
        batch.transferHistory.push({
            from: fromOrg,
            to: toOrg,
            timestamp: new Date().toISOString()
        });

        await ctx.stub.putState(batchID, Buffer.from(JSON.stringify(batch)));
        
        // Emit event
        ctx.stub.setEvent('BatchTransferred', Buffer.from(JSON.stringify({
            batchID: batchID,
            from: fromOrg,
            to: toOrg,
            timestamp: new Date().toISOString()
        })));
        
        console.info('============= END : Transfer Batch ===========');
        return JSON.stringify(batch);
    }

    // Flag batch for quarantine
    async flagQuarantine(ctx, batchID, reason) {
        console.info('============= START : Flag Quarantine ===========');
        
        const batchBuffer = await ctx.stub.getState(batchID);
        if (!batchBuffer || batchBuffer.length === 0) {
            throw new Error(`Batch ${batchID} does not exist`);
        }

        const batch = JSON.parse(batchBuffer.toString());
        batch.status = 'quarantined';
        batch.quarantineReason = reason;
        batch.quarantineTimestamp = new Date().toISOString();

        await ctx.stub.putState(batchID, Buffer.from(JSON.stringify(batch)));
        
        // Emit event
        ctx.stub.setEvent('BatchQuarantined', Buffer.from(JSON.stringify({
            batchID: batchID,
            reason: reason,
            timestamp: new Date().toISOString()
        })));
        
        console.info('============= END : Flag Quarantine ===========');
        return JSON.stringify(batch);
    }

    // Trigger recall
    async triggerRecall(ctx, batchID, recallReason, recallMeta) {
        console.info('============= START : Trigger Recall ===========');
        
        const batchBuffer = await ctx.stub.getState(batchID);
        if (!batchBuffer || batchBuffer.length === 0) {
            throw new Error(`Batch ${batchID} does not exist`);
        }

        const recallRecord = {
            objectType: 'recall',
            recallID: `recall_${batchID}_${Date.now()}`,
            batchID: batchID,
            reason: recallReason,
            recallMeta: JSON.parse(recallMeta),
            timestamp: new Date().toISOString(),
            initiator: ctx.clientIdentity.getID()
        };

        await ctx.stub.putState(recallRecord.recallID, Buffer.from(JSON.stringify(recallRecord)));

        // Update batch status
        await this._updateBatchStatus(ctx, batchID, 'recalled');
        
        // Emit event
        ctx.stub.setEvent('RecallTriggered', Buffer.from(JSON.stringify(recallRecord)));
        
        console.info('============= END : Trigger Recall ===========');
        return JSON.stringify(recallRecord);
    }

    // === QUERY FUNCTIONS ===

    // Query lineage for a batch
    async queryLineage(ctx, batchID) {
        console.info('============= START : Query Lineage ===========');
        
        const lineage = await this._buildLineage(ctx, batchID, []);
        
        console.info('============= END : Query Lineage ===========');
        return JSON.stringify(lineage);
    }

    // Query asset by ID
    async queryAsset(ctx, assetID) {
        const assetBuffer = await ctx.stub.getState(assetID);
        if (!assetBuffer || assetBuffer.length === 0) {
            throw new Error(`Asset ${assetID} does not exist`);
        }
        return assetBuffer.toString();
    }

    // Query assets by type
    async queryAssetsByType(ctx, objectType) {
        const queryString = {
            selector: {
                objectType: objectType
            }
        };

        const iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        const results = await this._getAllResults(iterator);
        return JSON.stringify(results);
    }

    // === HELPER FUNCTIONS ===

    async _updateBagOwnership(ctx, bagID, newOwner, eventID) {
        const bagBuffer = await ctx.stub.getState(bagID);
        if (bagBuffer && bagBuffer.length > 0) {
            const bag = JSON.parse(bagBuffer.toString());
            bag.owner = newOwner;
            bag.lastEvent = eventID;
            bag.status = 'collected';
            await ctx.stub.putState(bagID, Buffer.from(JSON.stringify(bag)));
        }
    }

    async _updateBagStatus(ctx, bagID, status, batchID) {
        const bagBuffer = await ctx.stub.getState(bagID);
        if (bagBuffer && bagBuffer.length > 0) {
            const bag = JSON.parse(bagBuffer.toString());
            bag.status = status;
            if (batchID) bag.currentBatch = batchID;
            await ctx.stub.putState(bagID, Buffer.from(JSON.stringify(bag)));
        }
    }

    async _updateBatchStatus(ctx, batchID, status) {
        const batchBuffer = await ctx.stub.getState(batchID);
        if (batchBuffer && batchBuffer.length > 0) {
            const batch = JSON.parse(batchBuffer.toString());
            batch.status = status;
            batch.lastStatusUpdate = new Date().toISOString();
            await ctx.stub.putState(batchID, Buffer.from(JSON.stringify(batch)));
        }
    }

    _checkGeoFence(species, lat, lon) {
        // Simplified geo-fence check
        // In production, this would check against complex polygons stored on-chain
        
        // Example: Allow Withania somnifera only in certain regions
        if (species === 'Withania somnifera') {
            return lat >= 20 && lat <= 35 && lon >= 70 && lon <= 90; // India region
        }
        
        // Default allow for demo
        return true;
    }

    _checkSeasonalWindow(species) {
        // Simplified seasonal check
        const currentMonth = new Date().getMonth() + 1; // 1-12
        
        // Example seasonal rules
        const seasonalRules = {
            'Withania somnifera': [10, 11, 12, 1, 2], // Oct-Feb
            'Curcuma longa': [1, 2, 3, 11, 12], // Nov-Mar
            'Ocimum tenuiflorum': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] // Year-round
        };

        const allowedMonths = seasonalRules[species] || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        return allowedMonths.includes(currentMonth);
    }

    _evaluateQualityGates(testResults) {
        // Simplified quality gate evaluation
        for (const test of testResults) {
            if (test.name === 'moisture' && test.value > 10) {
                return false; // Fail if moisture > 10%
            }
            if (test.name === 'contamination' && test.value > 0.1) {
                return false; // Fail if contamination > 0.1%
            }
        }
        return true;
    }

    async _buildLineage(ctx, batchID, visited = []) {
        if (visited.includes(batchID)) {
            return { batchID, error: 'Circular reference detected' };
        }
        
        visited.push(batchID);
        
        const batchBuffer = await ctx.stub.getState(batchID);
        if (!batchBuffer || batchBuffer.length === 0) {
            return { batchID, error: 'Batch not found' };
        }

        const batch = JSON.parse(batchBuffer.toString());
        const lineage = {
            batchID: batchID,
            type: batch.objectType,
            status: batch.status,
            owner: batch.owner,
            timestamp: batch.timestamp,
            parents: []
        };

        // Build parent lineage
        if (batch.parentBatches) {
            for (const parentID of batch.parentBatches) {
                const parentLineage = await this._buildLineage(ctx, parentID, [...visited]);
                lineage.parents.push(parentLineage);
            }
        }

        if (batch.parentBags) {
            for (const bagID of batch.parentBags) {
                const bagBuffer = await ctx.stub.getState(bagID);
                if (bagBuffer && bagBuffer.length > 0) {
                    const bag = JSON.parse(bagBuffer.toString());
                    lineage.parents.push({
                        bagID: bagID,
                        type: 'bag',
                        status: bag.status,
                        owner: bag.owner
                    });
                }
            }
        }

        return lineage;
    }

    async _getAllResults(iterator) {
        const allResults = [];
        let res = await iterator.next();
        
        while (!res.done) {
            if (res.value && res.value.value.toString()) {
                const jsonRes = {};
                jsonRes.Key = res.value.key;
                jsonRes.Record = JSON.parse(res.value.value.toString());
                allResults.push(jsonRes);
            }
            res = await iterator.next();
        }
        
        await iterator.close();
        return allResults;
    }
}

module.exports = HerbifyContract;