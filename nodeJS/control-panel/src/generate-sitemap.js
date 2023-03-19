const fs = require('fs');
const globby = require('globby');
const prettier = require('prettier');
(async () => {
    const prettierConfig  = await prettier.resolveConfig('./prettierrc.js');
    
})();