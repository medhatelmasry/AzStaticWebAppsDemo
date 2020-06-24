export class Constants {
     public static config = {
        endpoint: "ENDPOINT-HERE",
        key: "COSMOS-DB-KEY-HERE",
        databaseId: "Inventory",
        containerId: "Products",
        partitionKey: { kind: "Hash", paths: ["/brand/name"] }
    };
}