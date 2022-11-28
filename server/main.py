from HWiNFOWrapper import HWiNFOWrapper
import asyncio
import websockets
import json

SOCKET_ADDR = 'localhost'
SOCKET_PORT = 55005


async def handler(websocket, uri):
    message = await websocket.recv()
    response = ''
    if message == 'query':
        wrapper = HWiNFOWrapper()
        result, time = wrapper.query()
        if result is not None:
            response = json.dumps(result, ensure_ascii=False)
    await websocket.send(response)


async def main():
    async with websockets.serve(handler, SOCKET_ADDR, SOCKET_PORT):
        # run forever
        await asyncio.Future()


if __name__ == '__main__':
    print('start')
    asyncio.run(main())
