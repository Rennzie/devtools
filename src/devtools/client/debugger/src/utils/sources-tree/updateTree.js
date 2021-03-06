/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

// 

import { addToTree } from "./addToTree";
import { collapseTree } from "./collapseTree";
import { createDirectoryNode, createParentMap } from "./utils";
import { getDomain } from "./treeOrder";


function getSourcesToAdd(newSources, prevSources) {
  const sourcesToAdd = [];

  for (const sourceId in newSources) {
    const newSource = newSources[sourceId];
    const prevSource = prevSources ? prevSources[sourceId] : null;
    if (!prevSource) {
      sourcesToAdd.push(newSource);
    }
  }

  return sourcesToAdd;
}



export function createTree({ debuggeeUrl, sources, threads }) {
  const uncollapsedTree = createDirectoryNode("root", "", []);

  return updateTree({
    debuggeeUrl,
    newSources: sources,
    prevSources: {},
    threads,
    uncollapsedTree,
  });
}

export function updateTree({
  newSources,
  prevSources,
  debuggeeUrl,
  uncollapsedTree,
  threads,
}) {
  const debuggeeHost = getDomain(debuggeeUrl);
  const contexts = (Object.keys(newSources));

  contexts.forEach(context => {
    const thread = threads.find(t => t.actor === context);
    if (!thread) {
      return;
    }

    const sourcesToAdd = getSourcesToAdd(
      (Object.values(newSources[context])),
      prevSources[context] ? (Object.values(prevSources[context])) : null
    );

    for (const source of sourcesToAdd) {
      addToTree(uncollapsedTree, source, debuggeeHost, thread.actor);
    }
  });

  const newSourceTree = collapseTree(uncollapsedTree);

  return {
    uncollapsedTree,
    sourceTree: newSourceTree,
    parentMap: createParentMap(newSourceTree),
  };
}
