package com.hotelio.proto.booking;

import static io.grpc.MethodDescriptor.generateFullMethodName;

/**
 * <pre>
 * gRPC-сервис бронирования
 * </pre>
 */
@javax.annotation.Generated(
    value = "by gRPC proto compiler (version 1.64.0)",
    comments = "Source: booking.proto")
@io.grpc.stub.annotations.GrpcGenerated
public final class BookingServiceGrpc {

  private BookingServiceGrpc() {}

  public static final java.lang.String SERVICE_NAME = "booking.BookingService";

  // Static method descriptors that strictly reflect the proto.
  private static volatile io.grpc.MethodDescriptor<com.hotelio.proto.booking.BookingRequest,
      com.hotelio.proto.booking.BookingResponse> getCreateBookingMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "CreateBooking",
      requestType = com.hotelio.proto.booking.BookingRequest.class,
      responseType = com.hotelio.proto.booking.BookingResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<com.hotelio.proto.booking.BookingRequest,
      com.hotelio.proto.booking.BookingResponse> getCreateBookingMethod() {
    io.grpc.MethodDescriptor<com.hotelio.proto.booking.BookingRequest, com.hotelio.proto.booking.BookingResponse> getCreateBookingMethod;
    if ((getCreateBookingMethod = BookingServiceGrpc.getCreateBookingMethod) == null) {
      synchronized (BookingServiceGrpc.class) {
        if ((getCreateBookingMethod = BookingServiceGrpc.getCreateBookingMethod) == null) {
          BookingServiceGrpc.getCreateBookingMethod = getCreateBookingMethod =
              io.grpc.MethodDescriptor.<com.hotelio.proto.booking.BookingRequest, com.hotelio.proto.booking.BookingResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "CreateBooking"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.hotelio.proto.booking.BookingRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.hotelio.proto.booking.BookingResponse.getDefaultInstance()))
              .setSchemaDescriptor(new BookingServiceMethodDescriptorSupplier("CreateBooking"))
              .build();
        }
      }
    }
    return getCreateBookingMethod;
  }

  private static volatile io.grpc.MethodDescriptor<com.hotelio.proto.booking.BookingListRequest,
      com.hotelio.proto.booking.BookingListResponse> getListBookingsMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "ListBookings",
      requestType = com.hotelio.proto.booking.BookingListRequest.class,
      responseType = com.hotelio.proto.booking.BookingListResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<com.hotelio.proto.booking.BookingListRequest,
      com.hotelio.proto.booking.BookingListResponse> getListBookingsMethod() {
    io.grpc.MethodDescriptor<com.hotelio.proto.booking.BookingListRequest, com.hotelio.proto.booking.BookingListResponse> getListBookingsMethod;
    if ((getListBookingsMethod = BookingServiceGrpc.getListBookingsMethod) == null) {
      synchronized (BookingServiceGrpc.class) {
        if ((getListBookingsMethod = BookingServiceGrpc.getListBookingsMethod) == null) {
          BookingServiceGrpc.getListBookingsMethod = getListBookingsMethod =
              io.grpc.MethodDescriptor.<com.hotelio.proto.booking.BookingListRequest, com.hotelio.proto.booking.BookingListResponse>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "ListBookings"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.hotelio.proto.booking.BookingListRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.hotelio.proto.booking.BookingListResponse.getDefaultInstance()))
              .setSchemaDescriptor(new BookingServiceMethodDescriptorSupplier("ListBookings"))
              .build();
        }
      }
    }
    return getListBookingsMethod;
  }

  /**
   * Creates a new async stub that supports all call types for the service
   */
  public static BookingServiceStub newStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<BookingServiceStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<BookingServiceStub>() {
        @java.lang.Override
        public BookingServiceStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new BookingServiceStub(channel, callOptions);
        }
      };
    return BookingServiceStub.newStub(factory, channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static BookingServiceBlockingStub newBlockingStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<BookingServiceBlockingStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<BookingServiceBlockingStub>() {
        @java.lang.Override
        public BookingServiceBlockingStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new BookingServiceBlockingStub(channel, callOptions);
        }
      };
    return BookingServiceBlockingStub.newStub(factory, channel);
  }

  /**
   * Creates a new ListenableFuture-style stub that supports unary calls on the service
   */
  public static BookingServiceFutureStub newFutureStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<BookingServiceFutureStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<BookingServiceFutureStub>() {
        @java.lang.Override
        public BookingServiceFutureStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new BookingServiceFutureStub(channel, callOptions);
        }
      };
    return BookingServiceFutureStub.newStub(factory, channel);
  }

  /**
   * <pre>
   * gRPC-сервис бронирования
   * </pre>
   */
  public interface AsyncService {

    /**
     */
    default void createBooking(com.hotelio.proto.booking.BookingRequest request,
        io.grpc.stub.StreamObserver<com.hotelio.proto.booking.BookingResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getCreateBookingMethod(), responseObserver);
    }

    /**
     */
    default void listBookings(com.hotelio.proto.booking.BookingListRequest request,
        io.grpc.stub.StreamObserver<com.hotelio.proto.booking.BookingListResponse> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getListBookingsMethod(), responseObserver);
    }
  }

  /**
   * Base class for the server implementation of the service BookingService.
   * <pre>
   * gRPC-сервис бронирования
   * </pre>
   */
  public static abstract class BookingServiceImplBase
      implements io.grpc.BindableService, AsyncService {

    @java.lang.Override public final io.grpc.ServerServiceDefinition bindService() {
      return BookingServiceGrpc.bindService(this);
    }
  }

  /**
   * A stub to allow clients to do asynchronous rpc calls to service BookingService.
   * <pre>
   * gRPC-сервис бронирования
   * </pre>
   */
  public static final class BookingServiceStub
      extends io.grpc.stub.AbstractAsyncStub<BookingServiceStub> {
    private BookingServiceStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected BookingServiceStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new BookingServiceStub(channel, callOptions);
    }

    /**
     */
    public void createBooking(com.hotelio.proto.booking.BookingRequest request,
        io.grpc.stub.StreamObserver<com.hotelio.proto.booking.BookingResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getCreateBookingMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void listBookings(com.hotelio.proto.booking.BookingListRequest request,
        io.grpc.stub.StreamObserver<com.hotelio.proto.booking.BookingListResponse> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getListBookingsMethod(), getCallOptions()), request, responseObserver);
    }
  }

  /**
   * A stub to allow clients to do synchronous rpc calls to service BookingService.
   * <pre>
   * gRPC-сервис бронирования
   * </pre>
   */
  public static final class BookingServiceBlockingStub
      extends io.grpc.stub.AbstractBlockingStub<BookingServiceBlockingStub> {
    private BookingServiceBlockingStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected BookingServiceBlockingStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new BookingServiceBlockingStub(channel, callOptions);
    }

    /**
     */
    public com.hotelio.proto.booking.BookingResponse createBooking(com.hotelio.proto.booking.BookingRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getCreateBookingMethod(), getCallOptions(), request);
    }

    /**
     */
    public com.hotelio.proto.booking.BookingListResponse listBookings(com.hotelio.proto.booking.BookingListRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getListBookingsMethod(), getCallOptions(), request);
    }
  }

  /**
   * A stub to allow clients to do ListenableFuture-style rpc calls to service BookingService.
   * <pre>
   * gRPC-сервис бронирования
   * </pre>
   */
  public static final class BookingServiceFutureStub
      extends io.grpc.stub.AbstractFutureStub<BookingServiceFutureStub> {
    private BookingServiceFutureStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected BookingServiceFutureStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new BookingServiceFutureStub(channel, callOptions);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<com.hotelio.proto.booking.BookingResponse> createBooking(
        com.hotelio.proto.booking.BookingRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getCreateBookingMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<com.hotelio.proto.booking.BookingListResponse> listBookings(
        com.hotelio.proto.booking.BookingListRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getListBookingsMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_CREATE_BOOKING = 0;
  private static final int METHODID_LIST_BOOKINGS = 1;

  private static final class MethodHandlers<Req, Resp> implements
      io.grpc.stub.ServerCalls.UnaryMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ServerStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ClientStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.BidiStreamingMethod<Req, Resp> {
    private final AsyncService serviceImpl;
    private final int methodId;

    MethodHandlers(AsyncService serviceImpl, int methodId) {
      this.serviceImpl = serviceImpl;
      this.methodId = methodId;
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public void invoke(Req request, io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        case METHODID_CREATE_BOOKING:
          serviceImpl.createBooking((com.hotelio.proto.booking.BookingRequest) request,
              (io.grpc.stub.StreamObserver<com.hotelio.proto.booking.BookingResponse>) responseObserver);
          break;
        case METHODID_LIST_BOOKINGS:
          serviceImpl.listBookings((com.hotelio.proto.booking.BookingListRequest) request,
              (io.grpc.stub.StreamObserver<com.hotelio.proto.booking.BookingListResponse>) responseObserver);
          break;
        default:
          throw new AssertionError();
      }
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public io.grpc.stub.StreamObserver<Req> invoke(
        io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        default:
          throw new AssertionError();
      }
    }
  }

  public static final io.grpc.ServerServiceDefinition bindService(AsyncService service) {
    return io.grpc.ServerServiceDefinition.builder(getServiceDescriptor())
        .addMethod(
          getCreateBookingMethod(),
          io.grpc.stub.ServerCalls.asyncUnaryCall(
            new MethodHandlers<
              com.hotelio.proto.booking.BookingRequest,
              com.hotelio.proto.booking.BookingResponse>(
                service, METHODID_CREATE_BOOKING)))
        .addMethod(
          getListBookingsMethod(),
          io.grpc.stub.ServerCalls.asyncUnaryCall(
            new MethodHandlers<
              com.hotelio.proto.booking.BookingListRequest,
              com.hotelio.proto.booking.BookingListResponse>(
                service, METHODID_LIST_BOOKINGS)))
        .build();
  }

  private static abstract class BookingServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier, io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    BookingServiceBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return com.hotelio.proto.booking.BookingProto.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("BookingService");
    }
  }

  private static final class BookingServiceFileDescriptorSupplier
      extends BookingServiceBaseDescriptorSupplier {
    BookingServiceFileDescriptorSupplier() {}
  }

  private static final class BookingServiceMethodDescriptorSupplier
      extends BookingServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final java.lang.String methodName;

    BookingServiceMethodDescriptorSupplier(java.lang.String methodName) {
      this.methodName = methodName;
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.MethodDescriptor getMethodDescriptor() {
      return getServiceDescriptor().findMethodByName(methodName);
    }
  }

  private static volatile io.grpc.ServiceDescriptor serviceDescriptor;

  public static io.grpc.ServiceDescriptor getServiceDescriptor() {
    io.grpc.ServiceDescriptor result = serviceDescriptor;
    if (result == null) {
      synchronized (BookingServiceGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor = result = io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
              .setSchemaDescriptor(new BookingServiceFileDescriptorSupplier())
              .addMethod(getCreateBookingMethod())
              .addMethod(getListBookingsMethod())
              .build();
        }
      }
    }
    return result;
  }
}
