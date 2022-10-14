```cmd
touch .fly/scripts/1\_storage\_init.sh
```
<small>
Side Note: Start up scripts are run in numeric-alphabetical order. Naming `1\_storage\_init.sh` makes sure it is the first script run. Otherwise, naming the file as `storage_init.sh` alone would've moved the `caches.sh` script above it, and would've executed before storage initialization happened. One of the commands in the `caches.sh` will not have worked properly, due to a lack of properly initialized storage directory.
</small>

