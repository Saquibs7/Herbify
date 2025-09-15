#!/bin/bash

set -e

SCRIPTS_DIR=$(cd "$(dirname "$0")" && pwd)
PROJECT_ROOT=$(cd "${SCRIPTS_DIR}/.." && pwd)
NETWORK_DIR="${PROJECT_ROOT}/network"
CHANNEL_NAME="herbchannel"
WAIT_TIMEOUT=60

# --- Helper Functions ---
function print_header() {
  echo ""
  echo -e "\e[96m==== $1 ====\e[0m"
}

function print_success() {
  echo -e "\e[32m✅ $1\e[0m"
}

function print_error() {
  echo -e "\e[31m❌ ERROR: $1\e[0m"
  exit 1
}

function network_down() {
    print_header "Shutting down and cleaning old network..."
    for container in cli orderer.herbify.com peer0.farmer.herbify.com peer0.processor.herbify.com peer0.lab.herbify.com; do
        if [ "$(docker ps -a -q -f name=^/${container}$)" ]; then
            echo "Stopping and removing $container..."
            docker rm -f $container
        fi
    done
    if [ "$(docker network ls -q -f name=^herbify_network$)" ]; then
        echo "Removing network herbify_network..."
        docker network rm herbify_network
    fi
    rm -rf "${NETWORK_DIR}/channel-artifacts/"
    rm -rf "${NETWORK_DIR}/crypto-config/"
    print_success "Cleanup complete."
}

function generate_artifacts() {
    print_header "Generating cryptographic material..."
    mkdir -p "${NETWORK_DIR}/channel-artifacts"
    cryptogen generate --config="${NETWORK_DIR}/crypto-config.yaml" --output="${NETWORK_DIR}/crypto-config"
    print_success "Crypto material generated."

    export FABRIC_CFG_PATH="${NETWORK_DIR}/"
    print_header "Generating Genesis Block..."
    configtxgen -profile HerbifyGenesisProfile -outputBlock "${NETWORK_DIR}/channel-artifacts/genesis.block" -channelID system-channel
    print_success "Genesis block generated."

    print_header "Generating Channel Transaction..."
    configtxgen -profile HerbifyChannelProfile -outputCreateChannelTx "${NETWORK_DIR}/channel-artifacts/${CHANNEL_NAME}.tx" -channelID $CHANNEL_NAME
    print_success "Channel transaction generated."
}

function start_network() {
    print_header "Starting Docker containers using 'docker run'..."
    docker network create herbify_network || true

    docker run -d --rm \
      --name orderer.herbify.com --hostname orderer.herbify.com \
      --network herbify_network \
      -p 7050:7050 \
      -e FABRIC_LOGGING_SPEC=INFO \
      -e ORDERER_GENERAL_LISTENADDRESS=0.0.0.0 \
      -e ORDERER_GENERAL_LOCALMSPID=OrdererMSP \
      -e ORDERER_GENERAL_LOCALMSPDIR=/var/hyperledger/orderer/msp \
      -e ORDERER_GENERAL_GENESISMETHOD=file \
      -e ORDERER_GENERAL_GENESISFILE=/var/hyperledger/orderer/orderer.genesis.block \
      -e ORDERER_GENERAL_TLS_ENABLED=true \
      -e ORDERER_GENERAL_TLS_PRIVATEKEY=/var/hyperledger/orderer/tls/server.key \
      -e ORDERER_GENERAL_TLS_CERTIFICATE=/var/hyperledger/orderer/tls/server.crt \
      -e ORDERER_GENERAL_TLS_ROOTCAS=[/var/hyperledger/orderer/tls/ca.crt] \
      -v "${NETWORK_DIR}/channel-artifacts/genesis.block:/var/hyperledger/orderer/orderer.genesis.block:z" \
      -v "${NETWORK_DIR}/crypto-config/ordererOrganizations/herbify.com/orderers/orderer.herbify.com/msp:/var/hyperledger/orderer/msp:z" \
      -v "${NETWORK_DIR}/crypto-config/ordererOrganizations/herbify.com/orderers/orderer.herbify.com/tls/:/var/hyperledger/orderer/tls:z" \
      hyperledger/fabric-orderer:2.5

    # Start Peers
    start_peer "peer0.farmer.herbify.com" 7051 "FarmerOrgMSP"
    start_peer "peer0.processor.herbify.com" 9051 "ProcessorOrgMSP"
    start_peer "peer0.lab.herbify.com" 11051 "LabOrgMSP"

    print_header "Waiting for containers to become healthy..."
    wait_for_peer_ready "peer0.farmer.herbify.com"
    wait_for_peer_ready "peer0.processor.herbify.com"
    wait_for_peer_ready "peer0.lab.herbify.com"
    
    docker ps
    print_success "All containers are up and running."
}

function start_peer() {
    local PEER_NAME=$1
    local PEER_PORT=$2
    local MSP_ID=$3
    local ORG_DOMAIN=$(echo $PEER_NAME | cut -d'.' -f2)

    docker run -d --rm \
      --name $PEER_NAME --hostname $PEER_NAME \
      --network herbify_network \
      -p $PEER_PORT:$PEER_PORT \
      -e CORE_PEER_ID=$PEER_NAME \
      -e CORE_PEER_ADDRESS=$PEER_NAME:$PEER_PORT \
      -e CORE_PEER_LISTENADDRESS=0.0.0.0:$PEER_PORT \
      -e CORE_PEER_CHAINCODEADDRESS=${PEER_NAME}:$((${PEER_PORT}+1)) \
      -e CORE_PEER_CHAINCODELISTENADDRESS=0.0.0.0:$((${PEER_PORT}+1)) \
      -e CORE_PEER_GOSSIP_BOOTSTRAP=$PEER_NAME:$PEER_PORT \
      -e CORE_PEER_GOSSIP_EXTERNALENDPOINT=$PEER_NAME:$PEER_PORT \
      -e CORE_PEER_LOCALMSPID=$MSP_ID \
      -e CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock \
      -e CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=herbify_network \
      -e FABRIC_LOGGING_SPEC=INFO \
      -e CORE_PEER_TLS_ENABLED=true \
      -e CORE_PEER_BCCSP_DEFAULT=SW \
      -v /var/run/:/host/var/run/ \
      -v "${NETWORK_DIR}/crypto-config/peerOrganizations/${ORG_DOMAIN}.herbify.com/peers/${PEER_NAME}/msp:/etc/hyperledger/fabric/msp:z" \
      -v "${NETWORK_DIR}/crypto-config/peerOrganizations/${ORG_DOMAIN}.herbify.com/peers/${PEER_NAME}/tls:/etc/hyperledger/fabric/tls:z" \
      hyperledger/fabric-peer:2.5
}

function wait_for_peer_ready() {
    local peer_container=$1
    local start_time=$(date +%s)
    echo -n "Waiting for $peer_container to be ready..."
    
    while true; do
        if [ $(( $(date +%s) - start_time )) -gt $WAIT_TIMEOUT ]; then
            echo ""
            print_error "$peer_container did not become healthy within $WAIT_TIMEOUT seconds."
        fi
        
        if docker logs $peer_container 2>&1 | grep -q "Started peer with ID"; then
            echo " Done."
            return
        fi
        sleep 1
        echo -n "."
    done
}

function create_and_join_channel() {
    print_header "Starting CLI container..."
    docker run -d --rm -it \
        --name cli \
        --network herbify_network \
        -e FABRIC_LOGGING_SPEC=INFO \
        -v /var/run/:/host/var/run/ \
        -v "${PROJECT_ROOT}/chaincode/:/opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/:z" \
        -v "${NETWORK_DIR}/crypto-config:/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config:z" \
        -v "${NETWORK_DIR}/channel-artifacts:/opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts:z" \
        hyperledger/fabric-tools:2.5 sleep infinity
    print_success "CLI container started."

    print_header "Creating channel '$CHANNEL_NAME'..."
    docker exec \
      -e CORE_PEER_LOCALMSPID="FarmerOrgMSP" \
      -e CORE_PEER_TLS_ROOTCERT_FILE="/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/farmer.herbify.com/peers/peer0.farmer.herbify.com/tls/ca.crt" \
      -e CORE_PEER_MSPCONFIGPATH="/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/farmer.herbify.com/users/Admin@farmer.herbify.com/msp" \
      -e CORE_PEER_ADDRESS="peer0.farmer.herbify.com:7051" \
      cli peer channel create \
        -o orderer.herbify.com:7050 \
        -c $CHANNEL_NAME \
        -f "/opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/${CHANNEL_NAME}.tx" \
        --outputBlock "/opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/${CHANNEL_NAME}.block" \
        --tls --cafile "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/ordererOrganizations/herbify.com/orderers/orderer.herbify.com/msp/tlscacerts/tlsca.herbify.com-cert.pem"
    print_success "Channel '$CHANNEL_NAME' created."

    print_header "Waiting for channel creation to propagate..."
    sleep 5

    join_peer "FarmerOrg" "peer0.farmer.herbify.com" 7051
    join_peer "ProcessorOrg" "peer0.processor.herbify.com" 9051
    join_peer "LabOrg" "peer0.lab.herbify.com" 11051
}

function join_peer() {
    local ORG_NAME=$1
    local PEER_HOST=$2
    local PEER_PORT=$3
    local ORG_DOMAIN_LOWER=$(echo "$ORG_NAME" | cut -d'O' -f1 | tr '[:upper:]' '[:lower:]')
    
    print_header "Joining ${PEER_HOST} to channel..."
    docker exec \
      -e CORE_PEER_LOCALMSPID="${ORG_NAME}MSP" \
      -e CORE_PEER_TLS_ROOTCERT_FILE="/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/${ORG_DOMAIN_LOWER}.herbify.com/peers/${PEER_HOST}/tls/ca.crt" \
      -e CORE_PEER_MSPCONFIGPATH="/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/${ORG_DOMAIN_LOWER}.herbify.com/users/Admin@${ORG_DOMAIN_LOWER}.herbify.com/msp" \
      -e CORE_PEER_ADDRESS="${PEER_HOST}:${PEER_PORT}" \
      cli peer channel join -b "/opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/${CHANNEL_NAME}.block"
    print_success "${PEER_HOST} has joined the channel."
}


# --- Main Execution ---
network_down
generate_artifacts
start_network
create_and_join_channel

echo ""
print_success "Ayur-Trace development network is UP and RUNNING!"
echo "You can interact with the network using the 'cli' container:"
echo "  docker exec -it cli bash"