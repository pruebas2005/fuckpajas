-- Ejecuta esto UNA VEZ en Supabase > SQL Editor.
-- Ajusta el tipo de "id_user" (text / uuid / bigint...) si en tu tabla
-- no es texto: debe coincidir con la columna real.

-- Ranking total, agrupado por usuario, con filtro opcional por "opcion"
create or replace function ranking_total(filtro_opcion text default null)
returns table (id_user text, total bigint)
language sql
stable
as $$
  select id_user, count(*)::bigint as total
  from registro_pajas
  where filtro_opcion is null or opcion = filtro_opcion
  group by id_user
  order by total desc;
$$;

-- Ranking de un mes concreto, agrupado por usuario, con filtro opcional
create or replace function ranking_mes(
  fecha_inicio timestamptz,
  fecha_fin timestamptz,
  filtro_opcion text default null
)
returns table (id_user text, total bigint)
language sql
stable
as $$
  select id_user, count(*)::bigint as total
  from registro_pajas
  where momento >= fecha_inicio
    and momento < fecha_fin
    and (filtro_opcion is null or opcion = filtro_opcion)
  group by id_user
  order by total desc;
$$;

-- Permite invocarlas desde el cliente vía .rpc()
grant execute on function ranking_total(text) to anon, authenticated;
grant execute on function ranking_mes(timestamptz, timestamptz, text) to anon, authenticated;

-- Opcional pero recomendable si la tabla sigue creciendo: acelera
-- los filtros por fecha y por opción.
-- create index if not exists idx_registro_pajas_momento on registro_pajas (momento);
-- create index if not exists idx_registro_pajas_opcion on registro_pajas (opcion);
