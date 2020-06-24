import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { CosmosClient } from "@azure/cosmos";
import { Constants } from "../constants";

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const { endpoint, key, databaseId, containerId } = Constants.config;
    const client = new CosmosClient({ endpoint, key });

    const database = client.database(databaseId);
    const container = database.container(containerId);

    let iterator = container.items.readAll();
    let { resources } = await iterator.fetchAll();

    context.res = {
      // status: 200, /* Defaults to 200 */
      body: resources
    };
  } catch (err) {
    context.res = {
      status: 500,
      body: err.message
    };
  }
};

export default httpTrigger;