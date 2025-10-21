#!/bin/zsh
AMI_ID=$1
SNAPSHOT_ID=$(aws ec2 describe-images --image-ids $AMI_ID --query 'Images[0].BlockDeviceMappings[*].Ebs.SnapshotId' --output text)

aws ec2 deregister-image --image-id $AMI_ID

if [ "$SNAPSHOT_ID" != "None" ]; then
    aws ec2 delete-snapshot --snapshot-id $SNAPSHOT_ID
    echo "Snapshot $SNAPSHOT_ID eliminado."
fi

echo "AMI $AMI_ID eliminada."