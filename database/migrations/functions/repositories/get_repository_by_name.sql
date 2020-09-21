-- get_repository_by_name returns the repository identified by the name
-- provided as a json object.
create or replace function get_repository_by_name(p_name text)
returns setof json as $$
    select json_build_object(
        'repository_id', r.repository_id,
        'name', r.name,
        'display_name', r.display_name,
        'url', r.url,
        'kind', r.repository_kind_id,
        'verified_publisher', r.verified_publisher,
        'official', r.official,
        'user_alias', u.alias,
        'organization_name', o.name
    )
    from repository r
    left join "user" u using (user_id)
    left join organization o using (organization_id)
    where r.name = p_name;
$$ language sql;
