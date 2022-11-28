import _winapi
import ctypes
from ctypes import *

SENSOR_TYPE_NONE = 0
SENSOR_TYPE_TEMP = 1
SENSOR_TYPE_VOLT = 2
SENSOR_TYPE_FAN = 3
SENSOR_TYPE_CURRENT = 4
SENSOR_TYPE_POWER = 5
SENSOR_TYPE_CLOCK = 6
SENSOR_TYPE_USAGE = 7
SENSOR_TYPE_OTHER = 8


class HWiNFO_SENSORS_SHARED_MEM2(Structure):
    _pack_ = 1
    _fields_ = [('dwSignature', c_uint32),
                ('dwVersion', c_uint32),
                ('dwRevision', c_uint32),
                ('poll_time', c_uint64),
                ('dwOffsetOfSensorSection', c_uint32),
                ('dwSizeOfSensorElement', c_uint32),
                ('dwNumSensorElements', c_uint32),
                ('dwOffsetOfReadingSection', c_uint32),
                ('dwSizeOfReadingElement', c_uint32),
                ('dwNumReadingElements', c_uint32)]


class HWiNFO_SENSORS_SENSOR_ELEMENT(Structure):
    _pack_ = 1
    _fields_ = [('dwSensorID', c_uint32),
                ('dwSensorInst', c_uint32),
                ('szSensorNameOrig', c_char * 128),
                ('szSensorNameUser', c_char * 128)]


class HWiNFO_SENSORS_READING_ELEMENT(Structure):
    _pack_ = 1
    _fields_ = [('tReading', c_uint32),
                ('dwSensorIndex', c_uint32),
                ('dwReadingID', c_uint32),
                ('szLabelOrig', c_char * 128),
                ('szLabelUser', c_char * 128),
                ('szUnit', c_char * 16),
                ('Value', c_double),
                ('ValueMin', c_double),
                ('ValueMax', c_double),
                ('ValueAvg', c_double)]


class HWiNFOWrapper:
    def __init__(self):
        self._buffer = None
        self.masterSensorNames = []
        self.sizeReadingSection = None
        self.offsetReadingSection = None
        self.sizeSensorElement = None
        self.offsetSensorSection = None
        self.numReadingElements = None
        self.numSensors = None
        self._header = None
        self._buf = None
        self._size = None
        self.update_time = 0
        self._name = 'Global\\HWiNFO_SENS_SM2'
        self._encoding = 'gb2312'

    def open(self, last_update_time=0):
        self.masterSensorNames = []
        h_map = _winapi.OpenFileMapping(
            _winapi.FILE_MAP_READ,
            False,
            self._name
        )
        try:
            p_buf = _winapi.MapViewOfFile(
                h_map,
                _winapi.FILE_MAP_READ,
                0,
                0,
                0
            )
        finally:
            _winapi.CloseHandle(h_map)
        if p_buf is None:
            return False
        self._size = _winapi.VirtualQuerySize(p_buf)
        self._buffer = (c_char * self._size)()
        self._buf = addressof(self._buffer)
        ctypes.memmove(self._buf, p_buf, self._size)
        self._header = cast(self._buf, POINTER(HWiNFO_SENSORS_SHARED_MEM2)).contents
        self.update_time = self._header.poll_time
        self.numSensors = self._header.dwNumSensorElements
        self.numReadingElements = self._header.dwNumReadingElements
        self.offsetSensorSection = self._header.dwOffsetOfSensorSection
        self.sizeSensorElement = self._header.dwSizeOfSensorElement
        self.offsetReadingSection = self._header.dwOffsetOfReadingSection
        self.sizeReadingSection = self._header.dwSizeOfReadingElement
        self.populateSensorNames()
        return True

    def populateSensorNames(self):
        for num in range(self.numSensors):
            p = self._buf + self.offsetSensorSection + num * self.sizeSensorElement
            element = cast(p, POINTER(HWiNFO_SENSORS_SENSOR_ELEMENT)).contents
            self.masterSensorNames.append(string_at(element.szSensorNameUser).decode(encoding=self._encoding))

    def getNumSensorReadouts(self):
        return self.numReadingElements

    def getSensorUpdateTime(self):
        return self.update_time

    def getSensorData(self, dwReading):
        p = self._buf + self.offsetReadingSection + dwReading * self.sizeReadingSection
        element = cast(p, POINTER(HWiNFO_SENSORS_READING_ELEMENT)).contents
        index = int(element.dwSensorIndex)
        result = {}
        result['class'] = index
        result['type'] = element.tReading
        # result['class_name'] = self.masterSensorNames[index]
        result['name'] = string_at(element.szLabelUser).decode(encoding=self._encoding)
        result['value'] = element.Value
        result['unit'] = string_at(element.szUnit).decode(encoding=self._encoding)
        # result['time'] = self.getSensorUpdateTime()
        return result

    def close(self):
        pass

    def query(self):
        result = []
        if not self.open():
            return None, 0
        for i in range(len(self.masterSensorNames)):
            t = {'name': self.masterSensorNames[i], 'elements': []}
            result.append(t)
        for i in range(self.getNumSensorReadouts()):
            e = self.getSensorData(i)
            result[e['class']]['elements'].append(e)
        return result, self.getSensorUpdateTime()


if __name__ == '__main__':
    print('start')
    wrapper = HWiNFOWrapper()
    wrapper.open()
    # print(wrapper.masterSensorNames)
    # print(wrapper.getNumSensorReadouts())
    # for i in range(10):
    #     print(wrapper.getSensorData(i))
    print(wrapper.query())
