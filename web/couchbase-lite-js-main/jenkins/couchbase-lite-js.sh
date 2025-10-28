#!/bin/bash -ex

# Check if variable is set
chk_set() {
    var=$1
    if [[ -z "${!var}" ]]; then
        echo "\$${var} must be set!"
        exit 1
    fi
}

# Validate npmrc for registry authentication
validate_npmrc() {
    local registry=$1

    # Create or update ~/.npmrc
    if [[ ! -f ~/.npmrc ]]; then
        echo "Creating ~/.npmrc"
        chk_set NPM_TOKEN
        cat > ~/.npmrc << EOF
always-auth=true
//${registry}/:_authToken=${NPM_TOKEN}
EOF
    elif ! grep -q "always-auth=true" ~/.npmrc; then
        echo "always-auth=true" >> ~/.npmrc
    fi

    # Verify configuration based on registry type
    case "${registry}" in
        "registry.npmjs.org")
            npm whoami --registry="${registry}" >/dev/null 2>&1 || {
                echo "Error: ~/.npmrc is not configured for ${registry}"
                exit 1
            }
            ;;
        *)
            grep -q "${registry}" ~/.npmrc || {
                echo "Error: ~/.npmrc is not configured for ${registry}"
                exit 1
            }
            ;;
    esac
}

# Build the project
build() {
    NEW_VERSION=${VERSION}-${BLD_NUM}
    echo "SRC_DIR: ${SRC_DIR}"
    npm version $NEW_VERSION --no-git-tag-version --allow-same-version
    npm install --ignore-scripts --no-audit --no-fund
    npm ci
    npm run build
}

# Publish to registry
build_and_publish() {
    proget_registry="https://proget.sc.couchbase.com/npm/cbl-npm/"
    npmjs_registry="https://registry.npmjs.org/"
    if [[ -n "${PROD_PUSH}" && "${PROD_PUSH}" == "true" ]]; then
        validate_npmrc ${npmjs_registry}
        mkdir -p ${SRC_DIR}/dist
        pushd ${SRC_DIR}/dist

        # Download version with build number from internal registry (e.g., 1.2.3-123)
        # Strip build number from version and publish to npmjs.org
        npm pack couchbase-lite-js@${NEW_VERSION} --registry=${proget_registry}
        tar -xzf couchbase-lite-js-${NEW_VERSION}.tgz
        jq --arg ver "${VERSION}" '.version = $ver' package/package.json > package.json.tmp
        mv package.json.tmp package/package.json
        npm pack package
        npm publish couchbase-lite-js-${VERSION}.tgz --registry=${npmjs_registry}
        popd
    else
        validate_npmrc ${proget_registry#*//}
        pushd ${SRC_DIR}
        build
        npm publish --access public --registry ${proget_registry}
        popd
    fi
}

# Main
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC_DIR=${SCRIPT_DIR}/../

chk_set PRODUCT
chk_set VERSION
chk_set BLD_NUM

NODE_VERSION=$(curl -s https://nodejs.org/dist/index.json | \
    jq -r '.[] | select(.lts != false) | .version' | \
    head -1 | sed 's/^v//')
cbdep install nodejs ${NODE_VERSION}
export PATH=`pwd`/install/nodejs-${NODE_VERSION}/bin:${PATH}

build_and_publish
