import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { DocumentNode, GraphQLResolveInfo, parse } from 'graphql';
import { GqlContext } from '../@types';

export const getQueryPath = (ctx: GqlExecutionContext): string | null => {
  const queryDocument: DocumentNode = parse(ctx.getContext().req.body.query);
  const operationDefinition = queryDocument.definitions.find(
    (def) => def.kind === 'OperationDefinition',
  );
  const selectionSet = (
    operationDefinition['selectionSet']['selections'][0] as any
  ).selectionSet;
  const field = selectionSet.selections[0];

  return field.name.value;
};

export const isResolver = (context: ExecutionContext, reflector: Reflector) => {
  const publicResolverType = (
    type: 'isPublicResolver' | 'isSemiPublicResolver',
  ): boolean => {
    const isPublic = reflector.getAllAndOverride<boolean>(type, [
      context.getHandler(),
      context.getClass(),
    ]);
    const ctx = GqlExecutionContext.create(context);

    if (
      isPublic &&
      Array.isArray(isPublic) &&
      isPublic.includes(getQueryPath(ctx))
    )
      return true;
    return false;
  };

  return {
    public: (): boolean => {
      return publicResolverType('isPublicResolver');
    },
    semiPublic: (): boolean => {
      return publicResolverType('isSemiPublicResolver');
    },
  };
};

export const extractFields = (
  info: GraphQLResolveInfo,
  selections?: any,
): string[] => {
  const fields = new Set<string>();

  if (!selections) {
    selections = info.fieldNodes[0].selectionSet.selections;
  }

  selections.forEach((selection) => {
    if (selection.selectionSet) {
      // Add the field and recursively extract nested fields.
      fields.add(selection.name.value);
      extractFields(info, selection.selectionSet.selections).forEach(
        (subField) => fields.add(`${selection.name.value}.${subField}`), // This maintains the path.
      );
    } else {
      fields.add(selection.name.value);
    }
  });

  return Array.from(fields);
};

export const extractTokenFromHeaders = (headers: Headers): string => {
  return headers && headers['authorization']
    ? headers['authorization'].replace(/^Bearer\s+/i, '')
    : null;
};

export const extractTokenFromContext = (context: GqlContext): string => {
  const headers = context.req.headers;
  return extractTokenFromHeaders(headers);
};
