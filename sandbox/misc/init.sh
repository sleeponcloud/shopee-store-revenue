#! /bin/bash
if [ "$GROUP_ID" != "1000" ]; then
    echo "Create group ID $GROUP_ID..."
    groupadd -g $GROUP_ID sandbox
    echo "Change user group ID to $GROUP_ID..."
    usermod -g $GROUP_ID user
fi

if [ "$USER_ID" != "1000" ]; then
    echo "Change user ID to $USER_ID..."
    usermod -u $USER_ID user
fi

echo "Change docker socket permission to 666..."
sudo chmod 666 /var/run/docker.sock && \
su user
