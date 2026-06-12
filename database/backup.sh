#!/bin/bash
# Database Backup Automation Script
set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/puc_hub_backup_$TIMESTAMP.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "Starting PostgreSQL database backup..."
pg_dump "$DATABASE_URL" | gzip > "$BACKUP_FILE"
echo "Database backup completed: $BACKUP_FILE"

# Retention Policy: Delete backups older than 7 days
find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +7 -delete
echo "Retention cleaning completed."
