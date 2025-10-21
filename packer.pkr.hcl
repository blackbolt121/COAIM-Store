packer {
  required_plugins {
    amazon-ebs = {
      source  = "github.com/hashicorp/amazon"
      version = ">= 1.0.0"
    }
  }
}

variable "aws_region" {
  default = "us-east-2"
}

variable "ami_name" {
  default = "springboot-api"
}

variable "instance_type" {
  default = "t2.micro"
}

variable "source_ami" {
  default = "ami-0cb91c7de36eed2cb" # Ubuntu 22.04 LTS
}

variable "folder_source" {
  default = "./build/libs/smartshop-0.0.1-SNAPSHOT.jar"
}

source "amazon-ebs" "springboot_api" {
  region         = var.aws_region
  source_ami     = var.source_ami
  instance_type  = var.instance_type
  ssh_username   = "ubuntu"
  ami_name       = var.ami_name
  subnet_id      = "subnet-0d7dadf0fa21037f8"
}

build {
  sources = ["source.amazon-ebs.springboot_api"]

  # Crear el directorio antes de copiar archivos
  provisioner "shell" {
    inline = [
      "sudo mkdir -p /home/ubuntu/app",
      "sudo chown ubuntu:ubuntu /home/ubuntu/app"
    ]
  }

  # Copiar archivos al servidor
  provisioner "file" {
    source      = var.folder_source
    destination = "/home/ubuntu/app/smartshop-0.0.1-SNAPSHOT.jar"
  }

  provisioner "file" {
    source      = "./start.sh"
    destination = "/home/ubuntu/app/start.sh"
  }

  provisioner "file" {
    source      = "./springboot.service"
    destination = "/home/ubuntu/app/springboot.service"
  }

  # Instalar dependencias y configurar el servicio
  provisioner "shell" {
    inline = [
      "export DEBIAN_FRONTEND=noninteractive",
      "sudo apt update -y",
      "sudo apt install -y openjdk-21-jdk",
      "sudo apt install -y mysql-client-core-8.0",
      "sudo chmod +x /home/ubuntu/app/start.sh",
      "sudo chown -R ubuntu:ubuntu /home/ubuntu/app",
      "sudo cp /home/ubuntu/app/springboot.service /etc/systemd/system/springboot.service",
      "sudo systemctl daemon-reload",
      "sudo systemctl enable springboot",
      "sudo systemctl start springboot"
    ]
  }

  post-processor "manifest" {
    output = "packer-manifest.json"
  }
}
