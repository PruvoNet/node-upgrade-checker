import { METADATA_KEY, namedConstraint, taggedConstraint, interfaces } from 'inversify';
import Request = interfaces.Request;
import Abstract = interfaces.Abstract;

export type Constraint = (request: Request) => boolean;

export const namedOrMultiConstraint = (symbol: symbol, target: Abstract<unknown>): Constraint => {
  const tagConstraint = namedConstraint(symbol);
  const multiInjectConstraint = taggedConstraint(METADATA_KEY.MULTI_INJECT_TAG)(target);
  return (request: Request): boolean => {
    return multiInjectConstraint(request) || tagConstraint(request);
  };
};
