from flask import Flask, request, jsonify

from flask_cors import CORS

app = Flask(__name__)
CORS(app)

clientes_list = []
reservas_list = [] 

class Reserva ():
    def __init__(self, servicio, fecha, medico, hora):
        self.servicio = servicio
        self.fecha = fecha
        self.medico = medico
        self.hora = hora

    def __str__(self):
        self.servicio, self.fecha, self.medico, self.hora

class Cliente ():
    def __init__(self, rut, dig, name, surname, birthday, direccion, comuna, email, phone, password):
        self.rut = rut
        self.dig = dig
        self.name = name
        self.surname = surname
        self.birthday = birthday
        self.direccion = direccion
        self.comuna = comuna
        self.email = email
        self.phone = phone
        self.password = password
    
    def __str__(self):
        return self.rut, self.dig, self.name


@app.route('/api/register', methods=['POST'])
def register_cliente():
    data = request.json
    cliente = Cliente(
        rut=data['rutNum'],
        dig=data['rutDig'],
        name=data['name'],
        surname=data['surname'],
        birthday=data['birthday'],
        direccion=data['direccion'],
        comuna=data['comuna'],
        email=data['email'],
        phone=data['phone'],
        password=data['password']  # Asegúrate de hashear la contraseña
    )

    clientes_list.append(cliente)
    
    for cliente in clientes_list:
        print(cliente.rut, cliente.dig, cliente.password)
    return jsonify({
        'message': 'Cliente registrado con éxito!',
        "cliente": {
            "rut": cliente.rut,
            "dig": cliente.dig,
            "name": cliente.name,
            "surname": cliente.surname,
            "birthday": cliente.birthday,
            "direccion": cliente.direccion,
            "comuna": cliente.comuna,
            "email": cliente.email,
            "phone": cliente.phone,
            "password" : cliente.password
        }
        }), 201

@app.route('/api/login', methods=['POST'])
def login_cliente():
    data = request.json

    for cliente in clientes_list:
        print(cliente.rut, cliente.dig, cliente.password)
        if cliente.rut == data["rutNum"] and cliente.dig == data["rutDig"] and cliente.password == data["password"]:
            return jsonify({'message': "Login exitoso"}), 200

    return jsonify({'message': "Datos incorrectos"}), 401
    
@app.route('/api/userSchedule', methods = ['POST'])
def registrar_reservas():
    data = request.json

    reserva = Reserva(
        servicio = data["service"],
        fecha=data["date"],
        medico=data["doctor"],
        hora=data["timeSlot"]
    )

    try:
        reservas_list.append(reserva)   
        for reserva in reservas_list:
            print(reserva.servicio, reserva.fecha, reserva.medico, reserva.hora )
        return jsonify({"message": "Reserva registrada exitosamente."}), 201
    except:
        return jsonify({"message": "Ocurrió un error)"}), 500



@app.route('/api/userSchedule/servicios', methods=['GET'])
def get_servicios():
    servicios = [
        {"value": "consulta medica", "label": "Consulta médica"},
        {"value": "examen de laboratorio", "label": "Examen de laboratorio"},
        ]
    return jsonify(servicios)

@app.route('/api/userSchedule/medicos', methods=['GET'])
def get_medicos():
    medicos = [
        {"value": "dr-house", "label": "Dr. House"},
        {"value": "dr-who", "label": "Dr. Who"},
        ]
    return jsonify(medicos)

@app.route('/api/userSchedule/horarios', methods=['GET'])
def get_horarios():
    horarios = [
        {"value": "18:00", "label": "18:00"},
        {"value": "19:00", "label": "19:00"},
        ]
    return jsonify(horarios)

if __name__ == '__main__':
    app.run(debug=True)



    




    
