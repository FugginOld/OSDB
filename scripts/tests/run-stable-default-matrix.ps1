param()
$ErrorActionPreference = 'Stop'
node scripts/tests/run-stable-default-matrix.cjs
exit $LASTEXITCODE