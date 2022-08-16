---
title: Logging Stack Traces
layout: framework_docs
objective: Adjust Laravel's logging configuration to get a full stack trace.
order: 3
---

By default, we set the Logging output to use a `JsonFormatter`. This makes the log output a bit cleaner, but has the trade-off of not showing you a full stack trace.

If you need to get the full stack trace, update your `config/logging.php` file and adjust the `stderr` channel to include a `formatter_with` configuration:

```php
'stderr' => [
    'driver' => 'monolog',
    'level' => env('LOG_LEVEL', 'debug'),
    'handler' => StreamHandler::class,
    'formatter' => env('LOG_STDERR_FORMATTER'), // JsonFormatter
    'formatter_with' => [
        'includeStacktraces' => true,
    ],
    'with' => [
        'stream' => 'php://stderr',
    ],
],
```

This will show you the full stack trace of logged errors.