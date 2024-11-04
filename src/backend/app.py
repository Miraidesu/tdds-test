from flask import Flask, request, jsonify

from flask_cors import CORS

app = Flask(__name__)
CORS(app)

clientes_list = []
reservas_list = []
profiles_list = []


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


    
class Perfil ():
    def __init__(self, id, nombre, email, rol):
        self.id = id
        self.nombre = nombre
        self.email = email
        self.rol = rol

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.nombre,
            "email": self.email,
            "role": self.rol
        }
    
    def __str__(self):
        return self.id, self.nombre, self.email, self.rol


perfil_1 = Perfil(1, "John Doe", "john@example.com", "Medico")
perfil_2 = Perfil(2, "Jane Smith", "jane@example.com", "Contador")
perfil_3 = Perfil(3, "Alice Johnson", "alice@example.com", "Secretaria")
perfil_4 = Perfil(4, "Bob Williams", "bob@example.com", "Desarrollador")


profiles_list = [perfil_1, perfil_2, perfil_3, perfil_4]


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

@app.route('/api/createProfiles', methods=['GET', 'POST', 'PUT', 'DELETE'])

def manage_profiles():
    if request.method == "GET":
        roles_list = [
            {"value" : "Medico", "label" : "Medico"},
            {"value" : "Desarrollador", "label" : "Desarrollador"},
            {"value" : "Contador", "label" : "Contador"},
            {"value" : "Administrador", "label" : "Administrador"},
            {"value" : "Secretaria", "label" : "Secretaria"}
        ] 

        profiles_as_dicts = [perfil.to_dict() for perfil in profiles_list]

        
        return jsonify({"roles_list" : roles_list, "profiles_list" : profiles_as_dicts})
    
    elif request.method == "POST":              # añadir perfiles
        data = request.json
        id = 0
        new_id = max((perfil.id for perfil in profiles_list), default=0) + 1

        new_profile = Perfil(new_id, data["name"], data["email"], data["role"])
        profiles_list.append(new_profile)
        return jsonify({"message": "Perfil creado exitosamente"}), 201

    elif request.method == "PUT":               # actualizar perfiles
        data = request.json
        for perfil in profiles_list:
            if perfil.id == data["id"]:
                perfil.nombre = data["name"]
                perfil.email = data["email"]
                perfil.rol = data["role"]

                return jsonify({"message": "Perfil actualizado correctamente"}), 201
        
        return jsonify({"message": "Perfil no encontrado"}), 404

    elif request.method == "DELETE":
        data = request.json

        # Encontrar el perfil a eliminar
        perfil_to_delete = next((perfil for perfil in profiles_list if perfil.id == data['id']), None)

        if perfil_to_delete:
            profiles_list.remove(perfil_to_delete)  # Elimina el perfil de la lista

            profiles_as_dicts = [perfil.to_dict() for perfil in profiles_list]

            for perfil in profiles_as_dicts:
                print(perfil)

            return jsonify({"message": "Perfil eliminado correctamente"}), 200
        else:
            return jsonify({"message": "Perfil no encontrado"}), 404


if __name__ == '__main__':
    app.run(debug=True)



    




    
