-- ATLAS CODEx SQL WORKSPACE
-- All Codex-generated queries are logged here

-- Check latest checkpoints
select * from atlas_checkpoints
order by created_at desc
limit 50;

-- Detect risk blocks
select *
from atlas_checkpoints
where risk = 'HIGH' and allow = false;

-- Signal accuracy snapshot
select signal, count(*)
from atlas_checkpoints
group by signal;
