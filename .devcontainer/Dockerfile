FROM ghcr.io/anomalyco/opencode

RUN apk add git
RUN git config --global --add safe.directory /workspaces/springdiagram
RUN git config --global core.autocrlf true
RUN apk add --no-cache deno \
  --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community \
  --repository=http://dl-cdn.alpinelinux.org/alpine/edge/main
  