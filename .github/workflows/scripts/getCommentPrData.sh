#!/bin/bash

set -e

PR_NUMBER=$(jq -r ".issue.number" "$GITHUB_EVENT_PATH")
echo "Collecting information about PR #$PR_NUMBER of $GITHUB_REPOSITORY..."

if [[ -z "$GITHUB_TOKEN" ]]; then
	echo "Set the GITHUB_TOKEN env variable."
	exit 1
fi

URI=https://api.github.com
API_HEADER="Accept: application/vnd.github.v3+json"
AUTH_HEADER="Authorization: token $GITHUB_TOKEN"

pr_resp=$(curl -X GET -s -H "${AUTH_HEADER}" -H "${API_HEADER}" \
          "${URI}/repos/$GITHUB_REPOSITORY/pulls/$PR_NUMBER")

BASE_BRANCH=$(echo "$pr_resp" | jq -r .base.ref)

if [[ -z "$BASE_BRANCH" ]]; then
	echo "Cannot get base branch information for PR #$PR_NUMBER!"
	echo "API response: $pr_resp"
	exit 1
fi

HEAD_BRANCH=$(echo "$pr_resp" | jq -r .head.ref)
SHA=$(echo "$pr_resp" | jq -r .head.sha)

echo "Base branch for PR #$PR_NUMBER is $BASE_BRANCH"

PAYLOAD=$( jq -n \
                  --arg headRef "$HEAD_BRANCH" \
                  --arg baseRef "$BASE_BRANCH" \
                  --arg sha "$SHA" \
                  '{base_ref: $baseRef, head_ref: $headRef, sha: $sha, ref: $headRef}' )

echo "::set-output name=payload::$PAYLOAD"
