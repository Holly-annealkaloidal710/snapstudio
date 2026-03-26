SELECT relrowsecurity, relforcerowsecurity
FROM pg_class
WHERE relname = 'projects';