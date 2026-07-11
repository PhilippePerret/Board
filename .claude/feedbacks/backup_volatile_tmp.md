---
name: feedback-backup-volatile-tmp
description: Never stage a backup of real user data in a system-volatile temp dir ($TMPDIR/var/folders) — use a stable, project-local location
metadata:
  type: feedback
---

`Tests/version-*/run_tests.sh` backed up `~/Library/Application Support/Board` (the user's real app data) by moving it into `$(mktemp -d "${TMPDIR:-/tmp}/board-test-backup.XXXXXX")` before each test run, restoring it via a `trap` at the end. This is fragile: `$TMPDIR` (`/var/folders/.../T/`) is periodically purged by macOS, and anything that stops the trap from firing (forced quit, crash, sleep) leaves the backup orphaned there with no recovery path.

**Why:** Across a long test-debugging session, the user's real project data in `~/Library/Application Support/Board` ended up empty/default. No orphaned backup was found anywhere in `/tmp` or `/private/var/folders` despite an exhaustive search — consistent with a backup having been silently purged by the OS after an interruption somewhere in the session. Data was not recoverable. Fixed by moving `BACKUP_DIR` into `Tests/.board-backups/` (inside the repo, visible via `git status`, never auto-purged), and by changing `restore_board`'s final cleanup from `rm -rf "$BACKUP_DIR"` (always deletes, even on a failed restore) to `rmdir "$BACKUP_DIR"` (only removes if empty, i.e. only after a successful restore).

**How to apply:** Any script that moves/backs-up real (non-fixture, non-throwaway) user data as a safety net before a destructive operation must stage that backup in a stable, discoverable, version-control-visible location — never a system temp directory, and never delete the backup unconditionally at cleanup time.
