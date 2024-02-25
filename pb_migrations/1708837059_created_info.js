/// <reference path="../pb_data/types.d.ts" />
migrate(
	(db) => {
		const collection = new Collection({
			id: "nc2y9bz2isdwyae",
			created: "2024-02-25 04:57:39.065Z",
			updated: "2024-02-25 04:57:39.065Z",
			name: "info",
			type: "base",
			system: false,
			schema: [
				{
					system: false,
					id: "yhb9orqi",
					name: "career",
					type: "text",
					required: false,
					presentable: false,
					unique: false,
					options: {
						min: null,
						max: null,
						pattern: ""
					}
				},
				{
					system: false,
					id: "vjawierk",
					name: "info",
					type: "text",
					required: false,
					presentable: false,
					unique: false,
					options: {
						min: null,
						max: null,
						pattern: ""
					}
				}
			],
			indexes: [],
			listRule: null,
			viewRule: null,
			createRule: null,
			updateRule: null,
			deleteRule: null,
			options: {}
		});

		return Dao(db).saveCollection(collection);
	},
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId("nc2y9bz2isdwyae");

		return dao.deleteCollection(collection);
	}
);
