docker build . -t agusti/pioneer-h
# docker run -p 443:443 \
#         -e "VIRTUAL_HOST=pioneer.agustibau.com" \
#       -e "VIRTUAL_PORT=6565" \
#       -e "LETSENCRYPT_HOST=pioneer.agustibau.com" \
#       -e "LETSENCRYPT_EMAIL=agustibau@gmail.com" \
#       -d agusti/pioneer-h