/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "iayrkg3t6792bcn",
    "created": "2024-02-24 18:05:33.228Z",
    "updated": "2024-02-24 18:05:33.228Z",
    "name": "merge_cache",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "l0knaxe8",
        "name": "career1",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "ldbk5fwg",
        "name": "career2",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "wbqpbqfd",
        "name": "result",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [
      "CREATE INDEX `idx_HjolM7t` ON `merge_cache` (\n  `career1`,\n  `career2`,\n  `result`\n)"
    ],
    "listRule": "",
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("iayrkg3t6792bcn");

  return dao.deleteCollection(collection);
})
