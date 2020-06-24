import { CosmosClient } from "@azure/cosmos";
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Constants } from "../constants";
import { SeedData } from "../seed-data";
import { DbContext } from "../data/db-context";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const { endpoint, key, databaseId, containerId, partitionKey} = Constants.config;

    const client = new CosmosClient({ endpoint, key });

    const database = client.database(databaseId);
    const container = database.container(containerId);

    await DbContext.create(client, databaseId, containerId, partitionKey);

    let iterator = container.items.readAll();
    let { resources } = await iterator.fetchAll();

    if (resources.length > 0) {
      context.res = {
        // status: 200, /* Defaults to 200 */
        body: `The database is already seeded with ${resources.length} products.`
      };
    } else {
      
      const products = SeedData.getProducts();

      products.forEach(async function (item) {
        const { resource: createdItem } = await container.items.create(item);
        console.log(item);
      })
  
      context.res = {
        // status: 200, /* Defaults to 200 */
        body: `The database has been seeded with ${products.length} products.`
      };
    }


  } catch (err) {
    context.res = {
      status: 500,
      body: err.message
    };
  }
};

export default httpTrigger;