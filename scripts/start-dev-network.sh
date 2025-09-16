#!/bin/bash

set -e

SCRIPTS_DIR=$(cd "$(dirname "$0")" && pwd)
PROJECT_ROOT=$(cd "${SCRIPTS_DIR}/.." && pwd)
NETWORK_DIR="${PROJECT_ROOT}/network"
CHANNEL_NAME="herbchannel"
COMPOSE_FILE="${NETWORK_DIR}/docker-compose-fabric.yml"

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
    if [ -f "$COMPOSE_FILE" ]; then
        docker compose -f "$COMPOSE_FILE" down --volumes --remove-orphans
    fi
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
    if ! command -v cryptogen &> /dev/null || ! command -v configtxgen &> /dev/null; then
        print_error "cryptogen or configtxgen not found. Please ensure Hyperledger Fabric binaries are in your PATH."
    fi

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
    print_header "Starting Fabric network using Docker Compose..."
    docker compose -f "$COMPOSE_FILE" up -d
    
    echo "Waiting for network to stabilize..."
    sleep 10
    
    docker ps
    print_success "All containers are up and running."
}

function create_and_join_channel() {
    print_header "Creating channel '$CHANNEL_NAME'..."
    docker exec \
      -e CORE_PEER_TLS_ENABLED=true \
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
      -e CORE_PEER_TLS_ENABLED=true \
      -e CORE_PEER_LOCALMSPID="${ORG_NAME}MSP" \
      -e CORE_PEER_TLS_ROOTCERT_FILE="/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/${ORG_DOMAIN_LOWER}.herbify.com/peers/${PEER_HOST}/tls/ca.crt" \
      -e CORE_PEER_MSPCONFIGPATH="/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto-config/peerOrganizations/${ORG_DOMAIN_LOWER}.herbify.com/users/Admin@${ORG_DOMAIN_LOWER}.herbify.com/msp" \
      -e CORE_PEER_ADDRESS="${PEER_HOST}:${PEER_PORT}" \
      cli peer channel join -b "/opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/${CHANNEL_NAME}.block"
    print_success "${PEER_HOST} has joined the channel."
}

network_down
generate_artifacts
start_network
create_and_join_channel

echo ""
print_success "Herbify development network is UP and RUNNING!"
echo "You can interact with the network using the 'cli' container:"
echo "  docker exec -it cli bash"