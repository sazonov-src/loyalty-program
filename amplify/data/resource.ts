import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  User: a
    .model({
      bonusPoints: a.integer().default(0),      // Bonus points field
    })
    .authorization((allow) => [
      allow.authenticated().to(["get", "create"]),
    ]),

  AddBonus: a
    .mutation()
    .arguments({
      userId: a.id().required(),
    })
    .returns(a.ref("User").required())
    .authorization((allow) => [
      allow.authenticated()
    ])
    .handler(a.handler.custom({
      dataSource: a.ref("User"),
      entry: './add-bonus.js',
    })),

  WriteOffBonuses: a
    .mutation()
    .arguments({
      userId: a.id().required(),
      decrement: a.integer().required(),
    })
    .returns(a.ref("User").required())
    .authorization((allow) => [
      allow.authenticated(),
    ])
    .handler(a.handler.custom({
      dataSource: a.ref("User"),
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
