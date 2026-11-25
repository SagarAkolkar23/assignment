from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    """Wrap DRF error responses in a consistent JSON structure."""
    response = exception_handler(exc, context)
    if response is None:
        return None

    data = response.data
    if isinstance(data, dict) and 'detail' in data and len(data) == 1:
        message = str(data['detail'])
        details = None
    else:
        message = 'Request failed validation or could not be processed.'
        details = data

    payload = {
        'error': message,
        'status_code': response.status_code,
    }
    if details is not None:
        payload['details'] = details

    response.data = payload
    return response
