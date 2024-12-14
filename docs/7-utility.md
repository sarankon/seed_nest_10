# Utility

## Prettier
``` bash
npm install --save-dev prettier 
```

``` json
//.prettierrc
{
  "tabWidth": 4,
  "semi": true,
  "overrides": [
      {
            "files": "*.ts",
          "options": {
              "semi": false
          }
      }
  ]
}
```

## ESLint
``` bash
npm install eslint
npm install --save-dev eslint-config-prettier
```

### Initial ESLint
``` bash
npx eslint --init

You can also run this command directly using 'npm init @eslint/config@latest'.
Need to install the following packages:
@eslint/create-config@1.4.0
Ok to proceed? (y)


> angular18seed@0.0.0 npx
> create-config

@eslint/create-config: v1.4.0

√ How would you like to use ESLint? · problems    
√ What type of modules does your project use? · esm
√ Which framework does your project use? · none
√ Does your project use TypeScript? · typescript
√ Where does your code run? · node
The config that you've selected requires the following dependencies:

eslint, globals, @eslint/js, typescript-eslint
√ Would you like to install them now? · Yes
√ Which package manager do you want to use? · npm
☕️Installing...
npm warn idealTree Removing dependencies.eslint in favor of devDependencies.eslint
```

``` js
// eslint.config.mjs
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ["**/*.{js,mjs,cjs,ts}"] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "warn",
        },
    },
    eslintConfigPrettier,
];
```

## Faker
Reference: https://fakerjs.dev/

### Install
``` bash
npm install --save-dev @faker-js/faker 
```

``` bash
ng generate component demo/faker --prefix demo
```

