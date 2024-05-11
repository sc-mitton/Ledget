
ngrok http 127.0.0.1:443 --host-header='localhost' --log=stdout > ngrok.log &
sleep 1
grep "url=" ngrok.log | awk -F 'url=' '{print $2}' > .ngrok_plaid_tunnel
