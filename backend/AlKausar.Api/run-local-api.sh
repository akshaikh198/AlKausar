: "${MSSQL_SA_PASSWORD:?Set MSSQL_SA_PASSWORD in your environment or secret manager}"
docker compose up -d sqlserver

export ConnectionStrings__DefaultConnection="Server=localhost,1433;Database=AlKausar;User Id=sa;Password=${MSSQL_SA_PASSWORD};Encrypt=True;TrustServerCertificate=True"
export Jwt__Key="$(openssl rand -base64 48)"
export AdminBootstrap__Email="${ADMIN_BOOTSTRAP_EMAIL:?Set a unique administrator email}"
export AdminBootstrap__Password="${ADMIN_BOOTSTRAP_PASSWORD:?Set a unique administrator password through a secret manager}"

dotnet run --project backend/AlKausar.Api
