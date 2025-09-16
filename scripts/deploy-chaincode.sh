#!/bin/bash

set -e

CHAINCODE_NAME="herbify"
CHAINCODE_VERSION="1.0"
SEQUENCE="1" 
CHANNEL_NAME="herbchannel"
CHAINCODE_PATH="/opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode"
CHAINCODE_LANG="node"
PACKAGE_ID="" 

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' 

function print_header() {
    echo -e "${BLUE}==== $1 ====${NC}"
}

function print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

function print_error() {
    echo -e "${RED}❌ ERROR: $1${NC}"
    exit 1
}

function package_chaincode() {
    print_header "Packaging chaincode"
    docker exec cli peer lifecycle chaincode package ${CHAINCODE_NAME}.tar.gz \
        --path ${CHAINCODE_PATH} \
        --lang ${CHAINCODE_LANG} \
        --label ${CHAINCODE_NAME}_${CHAINCODE_VERSION}
    print_success "Chaincode packaged successfully"
}

function install_chaincode() {
    print_header "Installing chaincode on all peers"

    for org in farmer processor lab; do
        local peer_address=""
        local msp_id=""
        
        case $org in
            farmer) peer_address="peer0.farmer.herbify.com:7051"; msp_id="FarmerOrgMSP" ;;
            processor) peer_address="peer0.processor.herbify.com:9051"; msp_id="ProcessorOrgMSP" ;;
            lab) peer_address="peer0.lab.herbify.com:11051"; msp_id="LabOrgMSP" ;;
        esac
        
        local tls_rootcert_file="/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/${org}.herbify.com/peers/peer0.${org}.herbify.com/tls/ca.crt"
        local msp_config_path="/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/${org}.herbify.com/users/Admin@${org}.herbify.com/msp"
        
        print_header "Installing on $org peer"
        docker exec \
            -e CORE_PEER_TLS_ENABLED=true \
            -e CORE_PEER_LOCALMSPID="$msp_id" \
            -e CORE_PEER_TLS_ROOTCERT_FILE="$tls_rootcert_file" \
            -e CORE_PEER_MSPCONFIGPATH="$msp_config_path" \
            -e CORE_PEER_ADDRESS="$peer_address" \
            cli peer lifecycle chaincode install ${CHAINCODE_NAME}.tar.gz
    done
    print_success "Chaincode installed on all peers"
}

function query_installed() {
    print_header "Querying installed chaincode on Farmer peer"
    local result=$(docker exec \
        -e CORE_PEER_TLS_ENABLED=true \
        -e CORE_PEER_LOCALMSPID="FarmerOrgMSP" \
        -e CORE_PEER_TLS_ROOTCERT_FILE="/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/farmer.herbify.com/peers/peer0.farmer.herbify.com/tls/ca.crt" \
        -e CORE_PEER_MSPCONFIGPATH="/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/farmer.herbify.com/users/Admin@farmer.herbify.com/msp" \
        -e CORE_PEER_ADDRESS="peer0.farmer.herbify.com:7051" \
        cli peer lifecycle chaincode queryinstalled)
    
    PACKAGE_ID=$(echo "$result" | grep "Package ID:" | sed -n 's/Package ID: \(.*\), Label:.*/\1/p')

    if [ -z "$PACKAGE_ID" ]; then
        print_error "Could not retrieve Package ID. Installation might have failed."
    fi
    print_success "Got Package ID: ${PACKAGE_ID}"
}

function approve_for_org() {
    local org=$1
    local peer_address=""
    local msp_id=""
    
    case $org in
        farmer) peer_address="peer0.farmer.herbify.com:7051"; msp_id="FarmerOrgMSP" ;;
        processor) peer_address="peer0.processor.herbify.com:9051"; msp_id="ProcessorOrgMSP" ;;
        lab) peer_address="peer0.lab.herbify.com:11051"; msp_id="LabOrgMSP" ;;
    esac

    local tls_rootcert_file="/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/${org}.herbify.com/peers/peer0.${org}.herbify.com/tls/ca.crt"
    local msp_config_path="/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/${org}.herbify.com/users/Admin@${org}.herbify.com/msp"
    local orderer_ca_file="/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/ordererOrganizations/herbify.com/orderers/orderer.herbify.com/msp/tlscacerts/tlsca.herbify.com-cert.pem"

    print_header "Approving for $msp_id"
    docker exec \
        -e CORE_PEER_TLS_ENABLED=true \
        -e CORE_PEER_LOCALMSPID="$msp_id" \
        -e CORE_PEER_TLS_ROOTCERT_FILE="$tls_rootcert_file" \
        -e CORE_PEER_MSPCONFIGPATH="$msp_config_path" \
        -e CORE_PEER_ADDRESS="$peer_address" \
        cli peer lifecycle chaincode approveformyorg \
        -o orderer.herbify.com:7050 \
        --tls --cafile "$orderer_ca_file" \
        --channelID "$CHANNEL_NAME" \
        --name "$CHAINCODE_NAME" \
        --version "$CHAINCODE_VERSION" \
        --package-id "$PACKAGE_ID" \
        --sequence "$SEQUENCE" \
        --init-required

    print_success "Chaincode definition approved for $msp_id"
}

function check_commit_readiness() {
    print_header "Checking commit readiness"
    docker exec \
        -e CORE_PEER_TLS_ENABLED=true \
        -e CORE_PEER_LOCALMSPID="FarmerOrgMSP" \
        -e CORE_PEER_TLS_ROOTCERT_FILE="/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/farmer.herbify.com/peers/peer0.farmer.herbify.com/tls/ca.crt" \
        -e CORE_PEER_MSPCONFIGPATH="/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/farmer.herbify.com/users/Admin@farmer.herbify.com/msp" \
        -e CORE_PEER_ADDRESS="peer0.farmer.herbify.com:7051" \
        cli peer lifecycle chaincode checkcommitreadiness \
        --channelID "$CHANNEL_NAME" \
        --name "$CHAINCODE_NAME" \
        --version "$CHAINCODE_VERSION" \
        --sequence "$SEQUENCE" \
        --init-required --output json

    print_success "Commit readiness check passed"
}

function commit_and_init() {
    print_header "Committing chaincode definition"
    local orderer_ca_file="/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/ordererOrganizations/herbify.com/orderers/orderer.herbify.com/msp/tlscacerts/tlsca.herbify.com-cert.pem"
    local peer_conn_args="--peerAddresses peer0.farmer.herbify.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/farmer.herbify.com/peers/peer0.farmer.herbify.com/tls/ca.crt --peerAddresses peer0.processor.herbify.com:9051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/processor.herbify.com/peers/peer0.processor.herbify.com/tls/ca.crt --peerAddresses peer0.lab.herbify.com:11051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/lab.herbify.com/peers/peer0.lab.herbify.com/tls/ca.crt"
    
    docker exec \
        -e CORE_PEER_TLS_ENABLED=true \
        -e CORE_PEER_LOCALMSPID="FarmerOrgMSP" \
        -e CORE_PEER_TLS_ROOTCERT_FILE="/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/farmer.herbify.com/peers/peer0.farmer.herbify.com/tls/ca.crt" \
        -e CORE_PEER_MSPCONFIGPATH="/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/farmer.herbify.com/users/Admin@farmer.herbify.com/msp" \
        -e CORE_PEER_ADDRESS="peer0.farmer.herbify.com:7051" \
        cli peer lifecycle chaincode commit \
        -o orderer.herbify.com:7050 \
        --tls --cafile "$orderer_ca_file" \
        --channelID "$CHANNEL_NAME" \
        --name "$CHAINCODE_NAME" \
        --version "$CHAINCODE_VERSION" \
        --sequence "$SEQUENCE" \
        --init-required \
        $peer_conn_args
    
    print_success "Chaincode definition committed successfully"

    print_header "Invoking initLedger function"
    docker exec \
      -e CORE_PEER_TLS_ENABLED=true \
      -e CORE_PEER_LOCALMSPID="FarmerOrgMSP" \
      -e CORE_PEER_TLS_ROOTCERT_FILE="/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/farmer.herbify.com/peers/peer0.farmer.herbify.com/tls/ca.crt" \
      -e CORE_PEER_MSPCONFIGPATH="/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/farmer.herbify.com/users/Admin@farmer.herbify.com/msp" \
      -e CORE_PEER_ADDRESS="peer0.farmer.herbify.com:7051" \
      cli peer chaincode invoke \
      -o orderer.herbify.com:7050 \
      --tls --cafile "$orderer_ca_file" \
      -C "$CHANNEL_NAME" \
      -n "$CHAINCODE_NAME" \
      --isInit \
      -c '{"function":"initLedger","Args":[]}' \
      $peer_conn_args

    print_success "Chaincode initialized with initLedger"
}

package_chaincode
install_chaincode
query_installed
approve_for_org "farmer"
approve_for_org "processor"
approve_for_org "lab"
check_commit_readiness
commit_and_init

echo ""
print_success "Chaincode deployment and initialization complete!"