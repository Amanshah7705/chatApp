import { prisma } from "../main";
export const getFriends = async (data: any) => {
  try {
    const friends = await prisma.user.findMany({
      where: {
        username: {
          contains: data.name,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        username: true,
      },
    });
    return friends;
  } catch (error) {
    throw error;
  }
};
export const getChats = async (data: any) => {
  try {
    if (!data.destinationId && !data.groupId) {
      throw new Error("Invalid id");
    }
    if (data.destinationId) {
      const allChats = await prisma.chat.findMany({
        where: {
          OR: [
            {
              sourceId: data.sourceId,
              destinationId: data.destinationId,
            },
            {
              sourceId: data.destinationId,
              destinationId: data.sourceId,
            },
          ],
        },
        orderBy: {
          createdAt: "asc",
        },
        select: {
          createdAt: true,
          destination: true,
          destinationId: true,
          group: true,
          groupId: true,
          id: true,
          sourceId: true,
          text: true,
          source: true,
        },
      });
      return allChats;
    }
    if (data.groupId) {
      const allChats = await prisma.chat.findMany({
        where: {
          groupId: data.groupId,
        },
        orderBy: {
          createdAt: "asc",
        },
      });
      return allChats;
    }
  } catch (error) {
    throw error;
  }
};

export const myPreviousCon = async (data: any) => {
  try {
    const userGroups = await prisma.group.findMany({
      where: {
        OR: [
          { admin: { some: { id: data.sourceId } } },
          { members: { some: { id: data.sourceId } } },
        ],
      },
      select: {
        id: true,
      },
    });
    const groupIds = userGroups.map((group) => group.id);
    const allChats = await prisma.chat.findMany({
      where: {
        OR: [
          {
            sourceId: data.sourceId,
          },
          {
            destinationId: data.sourceId,
          },
          { groupId: { in: groupIds } },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        destination: true,
        group: true,
        createdAt: true,
        id: true,
        sourceId: true,
        destinationId: true,
        groupId: true,
        text: true,
        source: true,
      },
    });

    const mapper = new Map();

    allChats.forEach((userData) => {
      if (userData.groupId) {
        mapper.set(userData.groupId, userData);
      } else {
        //@ts-ignore
        const key = `${Math.min(
          //@ts-ignore
          userData.destinationId,
          userData.sourceId
          //@ts-ignore
        )}-${Math.max(userData.destinationId, userData.sourceId)}`;
        mapper.set(key, userData);
      }
    });

    const newData = Array.from(mapper.values());
    return newData;
  } catch (error) {
    throw error;
  }
};

export const createChat = async (data: any) => {
  try {
    if (!data.destinationId && !data.groupId) {
      throw new Error("Invalid id");
    }
    if (data.destinationId) {
      const createChat = await prisma.chat.create({
        data: {
          text: data.text,
          destinationId: data.destinationId,
          sourceId: data.sourceId,
        },
      });
      return createChat;
    }
    if (data.groupId) {
      const createChat = await prisma.chat.create({
        data: {
          text: data.text,
          groupId: data.groupId,
          sourceId: data.sourceId,
        },
      });
      return createChat;
    }
  } catch (error) {
    throw error;
  }
};

export const createGroup = async (data: any) => {
  try {
    const createGroup = await prisma.group.create({
      data: {
        name: data.name,
        admin: {
          connect: {
            id: data.sourceId,
          },
        },
      },
    });
    return createGroup;
  } catch (error) {
    throw error;
  }
};
