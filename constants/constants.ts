import { logger, retrieveEnvVariable } from "../utils"

export const PRIVATE_KEY = retrieveEnvVariable('PRIVATE_KEY', logger)
export const RPC_ENDPOINT = retrieveEnvVariable('RPC_ENDPOINT', logger)
export const RPC_WEBSOCKET_ENDPOINT = retrieveEnvVariable('RPC_WEBSOCKET_ENDPOINT', logger)

export const BUY_AMOUNT = Number(retrieveEnvVariable('BUY_AMOUNT', logger));

export const JITO_MODE = retrieveEnvVariable('JITO_MODE', logger) === 'true'
export const JITO_FEE = Number(retrieveEnvVariable('JITO_FEE', logger))

export const SLIPPAGE = Number(retrieveEnvVariable('SLIPPAGE', logger))

export const TARGET_ID =  retrieveEnvVariable('TARGET_ID', logger);
export const TWITTER_TOKEN = retrieveEnvVariable('TWITTER_TOKEN', logger);

