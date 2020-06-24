import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { CosmosClient } from "@azure/cosmos";
import { Constants } from "../constants";

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const { endpoint, key, databaseId, containerId} = Constants.config;

    const client = new CosmosClient({ endpoint, key });
    
    const database = client.database(databaseId);
    const container = database.container(containerId);

    const brand = req.body.brand;
    const id = req.params.id;

    console.log("brand >>>> ", brand);
    console.log("id >>>> ", id);

    const result = await container.item(id, brand.name).delete();

    context.res = {
      // status: 200, /* Defaults to 200 */
      body: result.resource
    };
  } catch (err) {
    context.res = {
      status: 500,
      body: err.message
    };
  }
};

export default httpTrigger;