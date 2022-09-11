import { isValuePermitted } from './value-permissions';
import './common';

import { readYAML } from './util';

function isValidConfig(extensions: unknown, ext: { configEntries: unknown }) {
  const config = ext.configEntries;
  // Check if required and suggested values are within the ranges specified by the spec.
}

function resolveDependencyOrder(extensions: Extension[]) {}

function hasDependencyRequirementsFulfilled(
  extensions: Extension[],
  ext: Extension
) {}

function isValidExtensionDependencyOrder(
  extensions: Extension[],
  ext: Extension
) {}

function isValidExtensionConfigOrder(extensions: Extension[], ext: Extension) {
  // Should this do it for all?
  // What if ext desired position is not at the end of extensions?
  // Should this function check a given order regardess of ext? Or ext focused?

  const results = Object.keys(ext.configEntries)
    .map((ce) => {
      const configEntry = ext.configEntries[ce];
      const specName = ce.split('.')[0];
      const es = extensions.filter(
        (e: { name: string }) => e.name === specName
      );
      if (es.length === 0) {
        throw new Error('error!');
      }
      const spec = es[0].optionEntries[ce];
      if (spec === undefined) throw new Error(`spec not found for '${ce}'`);

      if (configEntry.value['required-value'] !== undefined) {
        const p = isValuePermitted(
          configEntry.value['required-value'],
          spec,
          extensions.map((e) => e.configEntries)
        );
        if (p === undefined) {
          throw new Error('fail!');
        }
        console.log(p);
        if (p.status !== 'OK') {
          return {
            status: 'CONFLICT',
            reason: `required value (for "${ce}") by ${ext.name} conflicts with specifications of ${p.by}`,
            detail: p,
          };
        }
      }

      if (configEntry.value['required-values'] !== undefined) {
        const p = isValuePermitted(
          configEntry.value['required-values'],
          spec,
          extensions.map((e) => e.configEntries)
        );
        if (p.status !== 'OK') {
          return {
            status: 'CONFLICT',
            reason: `required values (for "${ce}") by ${ext.name} conflicts with specifications of ${p.by}`,
            detail: p,
          };
        }
      }

      return undefined;
    })
    .filter((r) => r !== undefined);

  if (results.length > 0) {
    console.log(results);
    return {
      status: 'CONFLICTS',
      count: results.length,
      conflicts: results,
    };
  }

  return {
    status: 'OK',
  };
}

function isAllValidExtensionConfigOrder(extensions: Extension[]) {
  const ss = extensions
    .slice(1)
    .map((ext, i) => {
      const exts = extensions.slice(0, i + 1);
      const s = isValidExtensionConfigOrder(exts, ext);
      return { ...s, extension: ext };
    })
    .filter((s) => s.status !== 'OK');

  if (ss.length === 0) {
    return {
      status: 'OK',
    };
  }

  return {
    status: 'CONFLICTS',
    conflicts: ss,
  };
}
