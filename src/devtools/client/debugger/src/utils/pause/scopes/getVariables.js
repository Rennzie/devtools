/* eslint max-nested-callbacks: ["error", 4] */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

// 
import { toPairs } from "lodash";


// VarAndBindingsPair actually is [name: string, contents: BindingContents]

// Scope's bindings field which holds variables and arguments

// Create the tree nodes representing all the variables and arguments
// for the bindings from a scope.
export function getBindingVariables(
  bindings,
  parentName
) {
  if (!bindings) {
    return [];
  }

  const rv = [];
  for (const { name, value } of bindings) {
    rv.push({
      name,
      path: `${parentName}/${name}`,
      contents: value,
    });
  }
  return rv;
}
