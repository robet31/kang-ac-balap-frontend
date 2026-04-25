-- ============================================================================
-- CHECK TABLE SCHEMA - Find Correct Column Names
-- ============================================================================

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS separator;
SELECT '🔍 CHECKING VEHICLES TABLE SCHEMA' AS title;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS separator;

SELECT 
  column_name AS "Column Name",
  data_type AS "Data Type",
  is_nullable AS "Nullable"
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'vehicles'
ORDER BY ordinal_position;

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS separator;
SELECT '🔍 CHECKING JOBS TABLE SCHEMA' AS title;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS separator;

SELECT 
  column_name AS "Column Name",
  data_type AS "Data Type",
  is_nullable AS "Nullable"
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'jobs'
ORDER BY ordinal_position;

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS separator;
SELECT '🔍 SAMPLE DATA FROM VEHICLES' AS title;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS separator;

SELECT * FROM public.vehicles LIMIT 3;

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS separator;
SELECT '🔍 SAMPLE DATA FROM JOBS' AS title;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS separator;

SELECT * FROM public.jobs LIMIT 3;
