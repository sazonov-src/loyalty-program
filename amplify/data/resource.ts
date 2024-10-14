import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Bonuses: a
    .model({
      bonusPoints: a.integer().default(0)
    })
    .authorization((allow) => [
      allow.ownerDefinedIn("id").to(["get"]),
      allow.group("admin").to(["get"]),
    ]),

  AddBonus: a
    .mutation()
    .arguments({
      id: a.string().required(),
    })
    .returns(a.ref("Bonuses").required())
    .authorization((allow) => [
      allow.group("admin"),
    ])
    .handler(a.handler.custom({
      dataSource: a.ref("Bonuses"),
      entry: './add-bonus.js',
    })),

  WriteOffBonuses: a
    .mutation()
    .arguments({
      id: a.string().required(),
      decrement: a.integer().required(),
    })
    .returns(a.ref("Bonuses").required())
    .authorization((allow) => [
      allow.group("admin"),
    ])
    .handler(a.handler.custom({
      dataSource: a.ref("Bonuses"),
      entry: './write-off-bonuses.js',
    })),
})

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
