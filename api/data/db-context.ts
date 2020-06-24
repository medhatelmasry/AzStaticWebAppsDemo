export class DbContext {
    static async create(client, databaseId, containerId, partitionKey) {

        /**
         * Create the database if it does not exist
         */
        let { database } = await client.databases.createIfNotExists({
          id: databaseId
        });
        
        console.log(`Created database:\n${database.id}\n`);
      
        /**
         * Create the container if it does not exist
         */
        let { container } = await client
          .database(databaseId)
          .containers.createIfNotExists(
            { id: containerId, partitionKey },
            { offerThroughput: 400 }
          );
      
        console.log(`Created container:\n${container.id}\n`);
      }
}