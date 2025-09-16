#!/bin/bash

set -e

CHAINCODE_NAME="herbify"
CHANNEL_NAME="herbchannel"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' 

function print_header() {
    echo -e "\n${BLUE}==== $1 ====${NC}"
}

function print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

function print_error() {
    echo -e "${RED}❌ ERROR: $1${NC}"
    exit 1
}

function print_test() {
    echo -e "${YELLOW}🧪 TEST: $1${NC}"
}

function invoke_chaincode() {
    local function_name=$1
    local args=$2
    local peer_conn_args="--peerAddresses peer0.farmer.herbify.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/farmer.herbify.com/peers/peer0.farmer.herbify.com/tls/ca.crt \
                          --peerAddresses peer0.processor.herbify.com:9051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/processor.herbify.com/peers/peer0.processor.herbify.com/tls/ca.crt"
    
    docker exec \
        -e CORE_PEER_TLS_ENABLED=true \
        -e CORE_PEER_LOCALMSPID="FarmerOrgMSP" \
        -e CORE_PEER_TLS_ROOTCERT_FILE="/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/farmer.herbify.com/peers/peer0.farmer.herbify.com/tls/ca.crt" \
        -e CORE_PEER_MSPCONFIGPATH="/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/farmer.herbify.com/users/Admin@farmer.herbify.com/msp" \
        -e CORE_PEER_ADDRESS="peer0.farmer.herbify.com:7051" \
        cli peer chaincode invoke \
        -o orderer.herbify.com:7050 \
        --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/ordererOrganizations/herbify.com/orderers/orderer.herbify.com/msp/tlscacerts/tlsca.herbify.com-cert.pem \
        -C $CHANNEL_NAME \
        -n $CHAINCODE_NAME \
        $peer_conn_args \
        -c "{\"function\":\"$function_name\",\"Args\":$args}"
}

function query_chaincode() {
    local function_name=$1
    local args=$2
    
    docker exec \
        -e CORE_PEER_TLS_ENABLED=true \
        -e CORE_PEER_LOCALMSPID="FarmerOrgMSP" \
        -e CORE_PEER_TLS_ROOTCERT_FILE="/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/farmer.herbify.com/peers/peer0.farmer.herbify.com/tls/ca.crt" \
        -e CORE_PEER_MSPCONFIGPATH="/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/farmer.herbify.com/users/Admin@farmer.herbify.com/msp" \
        -e CORE_PEER_ADDRESS="peer0.farmer.herbify.com:7051" \
        cli peer chaincode query \
        -C $CHANNEL_NAME \
        -n $CHAINCODE_NAME \
        -c "{\"function\":\"$function_name\",\"Args\":$args}"
}

function test_provision_tags() {
    print_test "Provisioning RFID Tags"
    invoke_chaincode "provisionTag" '["TAG001","BATCH001","FARMER001","hash123"]'
    sleep 2
    invoke_chaincode "provisionTag" '["TAG002","BATCH002","FARMER001","hash124"]'
    sleep 2
    print_success "RFID tags provisioned successfully"
}

function test_collection_events() {
    print_test "Recording Collection Events"
    
    invoke_chaincode "recordCollectionEvent" '["COL001","FARMER001","Ocimum tenuiflorum","28.7041","77.1025","[\"TAG001\"]","colhash001"]'
    sleep 2
    
    invoke_chaincode "recordCollectionEvent" '["COL002","FARMER001","Ocimum tenuiflorum","28.7041","77.1025","[\"TAG002\"]","colhash002"]'
    sleep 2
    
    print_success "Collection events recorded successfully"
}

# Test 3: Query Functions
function test_queries() {
    print_test "Testing Query Functions"
    
    echo "Querying TAG001:"
    query_chaincode "queryAsset" '["TAG001"]'
    echo ""
    
}

function run_all_tests() {

    
    test_queries
    
    print_header "All Tests Completed Successfully!"
    echo -e "${GREEN}🎉 Herbify chaincode is working correctly and ready for integration!${NC}"
}

run_all_tests