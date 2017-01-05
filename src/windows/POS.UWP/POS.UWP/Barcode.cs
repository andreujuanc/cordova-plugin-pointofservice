using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Text;
using System.Threading.Tasks;
using Windows.Devices.PointOfService;
using Windows.Foundation;

namespace POS.UWP
{
    public sealed class Barcode
    {
        public static IAsyncOperation<bool> SetActiveSymbologiesAsync(ClaimedBarcodeScanner claimedScanner, IEnumerable<uint> syms)
        {
           
            return AsyncInfo.Run<bool>((cancel) =>
            {
                return Task.Run<bool>(async () =>
                {
                    try
                    {
                        var a = claimedScanner.SetActiveSymbologiesAsync(syms);
                        await a;
                        return a.Status == AsyncStatus.Completed;
                    }
                    catch
                    {
                        return false;
                    }
                }, cancel);
            });
            //

            // return new Task<bool>(() => { return true; });
            //return claimedScanner.SetActiveSymbologiesAsync(syms);
        }
    }
}
