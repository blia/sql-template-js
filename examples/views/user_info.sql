-- User info view
CREATE VIEW "UserInfo" AS
    SELECT u.id, u.email, u.name, p.bio
    FROM "User" u
    LEFT JOIN "Profile" p ON u.id = p."userId";