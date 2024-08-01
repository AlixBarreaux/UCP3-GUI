/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line max-classes-per-file
import { Dependency, Package, Repository, Tree } from 'lean-resolution';
import { rcompare } from 'semver';

import { Extension } from '../../../config/ucp/common';
import { ConsoleLogger } from '../../../util/scripts/logging';

function extensionToID(ext: Extension) {
  return `${ext.name}@${ext.version}`;
}

export class Solution {
  status: string;

  packages: Package[];

  messages: string[];

  constructor(status: 'OK' | 'ERROR', packages: Package[], messages: string[]) {
    this.status = status;
    this.packages = packages;
    this.messages = messages;
  }

  get message() {
    return this.messages.join('\n\n');
  }
}

export class ExtensionSolution {
  status: string;

  extensions: Extension[] | undefined;

  messages: string[];

  constructor(
    status: 'OK' | 'ERROR',
    extensions: Extension[] | undefined,
    messages: string[],
  ) {
    this.status = status;
    this.extensions = extensions;
    this.messages = messages;
  }

  get message() {
    return this.messages.join('\n\n');
  }
}

type FailedInitialSolution = {
  status: 'error';
  messages: string[];
};

type SuccesfullInitialSolution = {
  status: 'ok';
};

export type InitialSolution = SuccesfullInitialSolution | FailedInitialSolution;

// eslint-disable-next-line import/prefer-default-export
export abstract class AbstractExtensionTree {
  tree: Tree = new Tree([]);

  frontendVersion: string;

  frameworkVersion: string;

  constructor(frontendVersion?: string, frameworkVersion?: string) {
    this.frontendVersion = frontendVersion || '0.0.0';
    this.frameworkVersion = frameworkVersion || '3.0.0';
  }

  abstract copy(): AbstractExtensionTree;

  get initialSolution() {
    if (this.tree.state === 'OK') {
      return {
        status: 'ok',
      } as InitialSolution;
    }

    return {
      status: 'error',
      messages: [...this.tree.errors],
    } as InitialSolution;
  }

  reset() {
    const repo: Repository = this.tree.packages.map(
      (e) =>
        new Package(
          e.name,
          e.version.raw,
          e.dependencies.map((d) => new Dependency(d.name, d.versionRange.raw)),
        ),
    );

    repo.push(new Package('frontend', this.frontendVersion));
    repo.push(new Package('framework', this.frameworkVersion));

    this.tree = new Tree(repo);
  }

  tryResolveAllDependencies() {
    try {
      this.tree.reset();
      this.tree.errors.splice(0, this.tree.errors.length);

      this.tree.setInitialTargetForAllEdges();

      if (this.tree.state === 'OK') {
        return {
          status: 'ok',
        } as InitialSolution;
      }

      return {
        status: 'error',
        messages: [...this.tree.errors],
      } as InitialSolution;
    } catch (err: any) {
      return {
        status: 'error',
        messages: [err.toString(), ...this.tree.errors],
      } as InitialSolution;
    }
  }

  dependenciesFor(id: string): Solution {
    const node = this.tree.nodeForID(id);

    this.tree.reset();
    this.tree.errors.splice(0, this.tree.errors.length);
    this.tree.setInitialTargetForAllEdges();

    try {
      const s = this.tree
        .solve([node.spec])
        .filter((e) => e.spec.name !== 'frontend')
        .filter((e) => e.spec.name !== 'framework')
        .map((n) => n.spec);

      return new Solution('OK', s, []);
    } catch (e) {
      return new Solution('ERROR', [], [`${e}`]);
    }
  }

  dependenciesForMultiple(ids: string[]): Solution {
    this.tree.reset();
    this.tree.errors.splice(0, this.tree.errors.length);

    const nodes = ids.map((id) => this.tree.nodeForID(id));

    try {
      const s = this.tree
        .solve(nodes.map((n) => n.spec))
        .filter((e) => e.spec.name !== 'frontend')
        .filter((e) => e.spec.name !== 'framework')
        .map((n) => n.spec);

      return new Solution('OK', s, []);
    } catch (e) {
      return new Solution('ERROR', [], [`${e}`]);
    }
  }

  directDependenciesFor(id: string) {
    const node = this.tree.nodeForID(id);

    const und = node.edgesOut.filter((e) => e.to === undefined);
    if (und.length > 0) {
      ConsoleLogger.error('undefined edges for: ', id, node, und);
    }

    return node.edgesOut
      .map((e) => e.to!)
      .filter((e) => e.spec.name !== 'frontend')
      .filter((e) => e.spec.name !== 'framework')
      .map((n) => n.spec);
  }

  reverseDependenciesFor(id: string) {
    const node = this.tree.nodeForID(id);

    return node.edgesIn
      .filter((e) => !e.from.id.startsWith('__user__'))
      .filter((e) => e.from.spec.name !== 'frontend')
      .filter((e) => e.from.spec.name !== 'framework')
      .map((e) => e.from.spec);
  }
}

export class ExtensionTree extends AbstractExtensionTree {
  extensions: Extension[];

  extensionsById: { [k: string]: Extension };

  constructor(
    extensions: Extension[],
    frontendVersion?: string,
    frameworkVersion?: string,
  ) {
    super(frontendVersion, frameworkVersion);
    this.extensions = extensions;
    this.extensionsById = Object.fromEntries(
      extensions.map((e) => [extensionToID(e), e]),
    );

    const repo: Repository = this.extensions.map(
      (e) =>
        new Package(
          e.name,
          e.version,
          Object.entries(e.definition.dependencies).map(
            ([ext, range]) => new Dependency(ext, range.raw),
          ),
        ),
    );

    repo.push(new Package('frontend', this.frontendVersion));
    repo.push(new Package('framework', this.frameworkVersion));

    this.tree = new Tree(repo);
  }

  copy() {
    return new ExtensionTree(
      this.extensions,
      this.frontendVersion,
      this.frameworkVersion,
    );
  }

  nodeForExtension(ext: Extension) {
    return this.tree.nodeForID(extensionToID(ext));
  }

  reverseExtensionDependenciesFor(ext: Extension) {
    return this.reverseDependenciesFor(`${ext.name}@${ext.version}`).map(
      (p) => this.extensionsById[p.id],
    );
  }

  directExtensionDependenciesFor(ext: Extension) {
    return this.directDependenciesFor(`${ext.name}@${ext.version}`).map(
      (p) => this.extensionsById[p.id],
    );
  }

  #convertSolution(s: Solution) {
    if (s.status === 'OK') {
      return new ExtensionSolution(
        s.status,
        s.packages.map((p) => this.extensionsById[p.id]),
        s.messages,
      );
    }
    return new ExtensionSolution('ERROR', undefined, s.messages);
  }

  extensionDependenciesFor(ext: Extension): ExtensionSolution {
    return this.#convertSolution(
      this.dependenciesFor(`${ext.name}@${ext.version}`),
    );
  }

  extensionDependenciesForExtensions(
    extensions: Extension[],
  ): ExtensionSolution {
    return this.#convertSolution(
      this.dependenciesForMultiple(
        extensions.map((ext) => `${ext.name}@${ext.version}`),
      ),
    );
  }

  allExtensionVersionsForName(name: string) {
    return this.extensions
      .filter((e) => e.name === name)
      .map((e) => e.version)
      .sort(rcompare);
  }
}
