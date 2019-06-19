# real-time-chart
A real-time chart example based on chartjs and [socket.io](https://github.com/socketio/socket.io-client).

The socket was built using [Flask-SocketIO](https://github.com/miguelgrinberg/Flask-SocketIO/) and the
code can be found in the socket directory.

The same chart component works with a publish/subscriber plataform built with the 
MQTT protocol (as [emitter-io](https://github.com/miguelgrinberg/Flask-SocketIO/), for instance).
