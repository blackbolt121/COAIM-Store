provider "aws" {
  region = "us-east-2"
}

# Creación del VPC
resource "aws_vpc" "my_vpc" {
  cidr_block = "10.0.0.0/16"
  enable_dns_support = true
  enable_dns_hostnames = true
  tags = { Name = "my-vpc" }
}

# Subred privada (AZ1)
resource "aws_subnet" "subnet_private_az1" {
  vpc_id                  = aws_vpc.my_vpc.id
  cidr_block              = "10.0.3.0/24"
  availability_zone       = "us-east-2a"
  tags = { Name = "subnet-private-az1" }
}

# Subred privada (AZ2)
resource "aws_subnet" "subnet_private_az2" {
  vpc_id                  = aws_vpc.my_vpc.id
  cidr_block              = "10.0.4.0/24"
  availability_zone       = "us-east-2b"
  tags = { Name = "subnet-private-az2" }
}

# Subred pública
resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.my_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-2a"
  map_public_ip_on_launch = true
  tags = { Name = "public-subnet" }
}

# Grupo de subredes de RDS
resource "aws_db_subnet_group" "my_db_subnet_group" {
  name       = "my-db-subnet-group"
  subnet_ids = [aws_subnet.subnet_private_az1.id, aws_subnet.subnet_private_az2.id]
  tags = { Name = "my-db-subnet-group" }
}

# Gateway de Internet
resource "aws_internet_gateway" "my_igw" {
  vpc_id = aws_vpc.my_vpc.id
  tags = { Name = "my-internet-gateway" }
}

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.my_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.my_igw.id
  }
  tags = { Name = "Public Route Table" }
}

resource "aws_route_table_association" "public_subnet_association" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.public_rt.id
}

# Grupo de seguridad para RDS
resource "aws_security_group" "mysql_sg" {
  name        = "mysql-sg"
  description = "Security group for MySQL RDS"
  vpc_id      = aws_vpc.my_vpc.id

  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    security_groups = [aws_security_group.ec2_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = { Name = "mysql-sg" }
}
resource "aws_eip" "nat_eip" {
  domain = "vpc"
}

# NAT Gateway en la subred pública
resource "aws_nat_gateway" "nat_gw" {
  allocation_id = aws_eip.nat_eip.id
  subnet_id     = aws_subnet.public_subnet.id

  tags = { Name = "nat-gateway" }
}

resource "aws_route_table" "private_rt" {
  vpc_id = aws_vpc.my_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat_gw.id
  }

  tags = { Name = "Private Route Table" }
}

resource "aws_route_table_association" "private_subnet_association_az1" {
  subnet_id      = aws_subnet.subnet_private_az1.id
  route_table_id = aws_route_table.private_rt.id
}

resource "aws_route_table_association" "private_subnet_association_az2" {
  subnet_id      = aws_subnet.subnet_private_az2.id
  route_table_id = aws_route_table.private_rt.id
}

# Instancia de RDS MySQL
resource "aws_db_instance" "mariadb" {
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "mariadb"
  engine_version       = "11.4.4"
  instance_class       = "db.t3.micro"
  db_name              = "test"
  username             = "admin"
  password             = "yourpassword123"
  db_subnet_group_name = aws_db_subnet_group.my_db_subnet_group.id
  vpc_security_group_ids = [aws_security_group.mysql_sg.id]
  publicly_accessible  = false
  multi_az             = false
  skip_final_snapshot  = true
  backup_retention_period = 0
  tags = { Name = "MariaDB-RDS" }
}

resource "aws_route53_zone" "private_zone" {
  name = "smartshop.internal"

  vpc {
    vpc_id = aws_vpc.my_vpc.id
  }

  tags = {
    Name = "Private Zone for Internal Resources"
  }
}

resource "aws_route53_record" "database_alias" {
  zone_id = aws_route53_zone.private_zone.zone_id
  name    = "database.smartshop.internal"
  type    = "CNAME"
  ttl     = 300
  records = [aws_db_instance.mariadb.address]
}

# Grupo de seguridad para EC2
resource "aws_security_group" "ec2_sg" {
  name        = "ec2-sg"
  description = "Security group for EC2"
  vpc_id      = aws_vpc.my_vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Cambiar por tu IP si es necesario
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Cambiar por tu IP si es necesario
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Cambiar por tu IP si es necesario
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = { Name = "ec2-sg" }
}
resource "aws_key_pair" "eks_key" {

  key_name   = "eks-key"

  public_key = file("~/.ssh/id_rsa.pub")  # Usa la clave pública existente

}

resource "aws_network_interface" "private_eni" {
  subnet_id       = aws_subnet.subnet_private_az1.id
  security_groups = [aws_security_group.ec2_sg.id]
}

resource "aws_network_interface" "public_eni" {
  subnet_id       = aws_subnet.public_subnet.id
  security_groups = [aws_security_group.ec2_sg.id]
  tags = { Name = "Public-ENI" }
}

resource "aws_eip" "public_ip" {
  domain = "vpc"
}

resource "aws_eip_association" "eip_assoc" {
  network_interface_id = aws_network_interface.public_eni.id
  allocation_id        = aws_eip.public_ip.id
}

resource "aws_instance" "my_ec2" {
  ami             = "ami-0750ef5b8e0f9106e"
  instance_type   = "t2.micro"
  key_name        = "eks-key"
  network_interface {
    network_interface_id = aws_network_interface.private_eni.id
    device_index         = 0
  }

  network_interface {
    network_interface_id = aws_network_interface.public_eni.id
    device_index         = 1
  }

  tags = { Name = "EC2-Instance" }

  depends_on = [aws_db_instance.mariadb, aws_route53_zone.private_zone, aws_route53_record.database_alias]
}

resource "aws_api_gateway_rest_api" "smartshop_api" {
  name        = "smartshop-api"
  description = "API Gateway que funciona como proxy para EC2"
}

resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = aws_api_gateway_rest_api.smartshop_api.id
  parent_id   = aws_api_gateway_rest_api.smartshop_api.root_resource_id
  path_part   = "/"  # Captura todas las rutas
}

resource "aws_api_gateway_method" "proxy_method" {
  rest_api_id   = aws_api_gateway_rest_api.smartshop_api.id
  resource_id   = aws_api_gateway_resource.proxy.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "proxy_integration" {
  rest_api_id             = aws_api_gateway_rest_api.smartshop_api.id
  resource_id             = aws_api_gateway_resource.proxy.id
  http_method             = aws_api_gateway_method.proxy_method.http_method
  integration_http_method = "ANY"
  type                    = "HTTP_PROXY"
  uri                     = "http://${aws_instance.my_ec2.public_ip}:8080" # Redirige a EC2
}

resource "aws_api_gateway_deployment" "smartshop_api_deployment" {
  depends_on = [aws_api_gateway_integration.proxy_integration]
  rest_api_id = aws_api_gateway_rest_api.smartshop_api.id
}

# Configuración para la aplicación Amplify (frontend)
resource "aws_amplify_app" "frontend" {
  name        = "smartshop-frontend"
  repository  = "https://github.com/blackbolt121/smarshop-frontend"
  oauth_token = ""

  enable_auto_branch_creation = true
  enable_branch_auto_build    = true
  environment_variables = {
    VITE_API_BASE_URL = "http://${aws_eip_association.eip_assoc.public_ip}:8080"
  }
  auto_branch_creation_config {
    enable_auto_build = true
  }
  depends_on = [aws_instance.my_ec2]
}




resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.frontend.id
  branch_name = "main"
  depends_on = [aws_instance.my_ec2]
}

output "public_ip" {
  value = aws_eip_association.eip_assoc.public_ip
}

output "database_address" {
  value = aws_db_instance.mariadb.address
}

output "amplify_url" {
  value = aws_amplify_app.frontend.default_domain
}

output "ec2_private_ip" {
  value = aws_instance.my_ec2.private_ip
}
