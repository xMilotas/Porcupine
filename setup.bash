# Updating
docker pull rhasspy/rhasspy
docker stop rhasspy
docker rm rhasspy
docker run -d -p 12101:12101 \
      --name rhasspy \
      --restart unless-stopped \
      -v "$HOME/.config/rhasspy/profiles:/profiles" \
      -v "/etc/localtime:/etc/localtime:ro" \
      --device /dev/snd:/dev/snd \
      rhasspy/rhasspy \
      --user-profiles /profiles \
      --profile de


# Move new sound files to docker image as these are not part of the distribution
docker cp error.wav rhasspy:/usr/lib/rhasspy/etc/wav/error.wav
docker cp end_of_input.wav rhasspy:/usr/lib/rhasspy/etc/wav/end_of_input.wav
docker cp start_of_input.wav rhasspy:/usr/lib/rhasspy/etc/wav/start_of_input.wav

