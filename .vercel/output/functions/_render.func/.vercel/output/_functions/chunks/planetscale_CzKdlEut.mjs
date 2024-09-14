import { Kysely } from "kysely";
import { PlanetScaleDialect } from "kysely-planetscale";
const queryBuilder = new Kysely({
  dialect: new PlanetScaleDialect({
    url: ""
  })
});
export {
  queryBuilder as q
};
